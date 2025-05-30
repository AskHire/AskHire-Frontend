import axios from 'axios';

const API_URL = 'http://localhost:5190/api/Auth';

// Axios instance with base config
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Store tokens in memory
let accessToken = null;
let refreshTokenTimeoutId = null;

// Utility to read cookies with better error handling
const getCookie = (name) => {
  try {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        let cookieValue = cookie.substring(name.length + 1);
        try {
          return decodeURIComponent(cookieValue);
        } catch (e) {
          console.warn('Failed to decode cookie value:', cookieValue);
          return cookieValue; // Return raw value if decoding fails
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error reading cookie:', error);
    return null;
  }
};

// Parse JWT to get expiration time
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

// Set up automatic refresh before token expires
const setupRefreshTimer = (token) => {
  try {
    if (!token) return;
    
    // Clear any existing timeout
    if (refreshTokenTimeoutId) {
      clearTimeout(refreshTokenTimeoutId);
    }

    const tokenData = parseJwt(token);
    if (!tokenData || !tokenData.exp) return;

    // Get time until expiration (in ms) and subtract buffer time (2 minutes)
    const expiresIn = (tokenData.exp * 1000) - Date.now() - 120000;
    
    // Only set timeout if token is not already expired
    if (expiresIn <= 0) {
      console.log('Token already expired, refreshing now...');
      refreshAccessToken();
      return;
    }

    console.log(`Setting up refresh timer for ${Math.round(expiresIn / 1000)} seconds from now`);
    
    refreshTokenTimeoutId = setTimeout(() => {
      console.log('Token refresh timer triggered');
      refreshAccessToken();
    }, expiresIn);
  } catch (error) {
    console.error('Error setting up refresh timer:', error);
  }
};

// Function to refresh access token using the refresh token stored in cookies
const refreshAccessToken = async () => {
  try {
    console.log('Attempting to refresh access token...');
    
    // Skip the interceptor for this call to avoid infinite loops
    const response = await axios.post(`${API_URL}/refresh-token`, {}, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      skipAuthRefresh: true
    });
    
    if (response.data && response.data.accessToken) {
      accessToken = response.data.accessToken;
      console.log('Access token refreshed successfully');
      
      // Set up the next refresh
      setupRefreshTimer(accessToken);
      
      return accessToken;
    } else {
      console.warn('Refresh response did not contain accessToken:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Refresh token failed:', error);
    accessToken = null; // Clear invalid token
    throw error;
  }
};

// Initialize token from cookies when module loads
const initializeTokenFromCookies = () => {
  const token = getCookie('jwt');
  if (token) {
    accessToken = token;
    setupRefreshTimer(token);
  }
};

// Call initialization
initializeTokenFromCookies();

// Attach JWT token from in-memory storage to each request
apiClient.interceptors.request.use(
  config => {
    // Skip adding token for refresh requests marked with skipAuthRefresh
    if (config.skipAuthRefresh) {
      return config;
    }

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      const token = getCookie('jwt');
      if (token) {
        accessToken = token;
        config.headers['Authorization'] = `Bearer ${token}`;
        // Set up timer for future refresh
        setupRefreshTimer(token);
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// Queue to manage token refresh requests to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor to handle 401 errors and refresh the token automatically
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Don't retry refresh token requests to avoid loops
    if (originalRequest.url === '/refresh-token') {
      return Promise.reject(error);
    }

    // Handle cases where there's no response object (network errors)
    if (!error.response) {
      return Promise.reject(error);
    }

    // If token expired (401), retry the request with a new token
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a token refresh is in progress, queue the request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      // Mark the request as retried
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken(); // Get a new token
        
        if (!newToken) {
          throw new Error('Failed to get new token during refresh');
        }
        
        accessToken = newToken; // Update the in-memory access token
        processQueue(null, newToken); // Resolve the queue with new token

        // Retry the failed request with the new token
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null); // Reject the queue if token refresh fails
        
        // If refreshing fails, we might need to redirect to login
        if (window.dispatchEvent) {
          // Dispatch custom event that AuthContext can listen for
          window.dispatchEvent(new CustomEvent('auth:tokenRefreshFailed'));
        }
        
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth Service with exported methods
export const authService = {
  async register(userData) {
    try {
      const response = await apiClient.post('/register', userData);
      // Backend returns user data, not tokens, so no need to set accessToken
      return response.data; // Return user data (e.g., { Email, Id, Role })
    } catch (error) {
      throw handleError(error);
    }
  },

  async login(credentials) {
    try {
      const response = await apiClient.post('/login', credentials);
      
      // Handle both explicit token in response and cookie-based tokens
      if (response.data && response.data.accessToken) {
        accessToken = response.data.accessToken;
        setupRefreshTimer(accessToken);
      } else {
        // Try to get token from cookies
        const cookieToken = getCookie('jwt');
        if (cookieToken) {
          accessToken = cookieToken;
          setupRefreshTimer(cookieToken);
        }
      }
      
      console.log('Login successful, tokens set up');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async logout() {
    try {
      // Clear token refresh timer
      if (refreshTokenTimeoutId) {
        clearTimeout(refreshTokenTimeoutId);
        refreshTokenTimeoutId = null;
      }
      
      // Clear in-memory token
      accessToken = null;
      
      // Call logout endpoint
      await apiClient.post('/logout');
    } catch (error) {
      throw handleError(error);
    }
  },

  async getCurrentUser(retry = true) {
    try {
      const response = await apiClient.get('/user');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 && retry) {
        console.log('Getting current user failed, trying refresh...');
        try {
          const newToken = await refreshAccessToken(); // Refresh the token
          if (!newToken) {
            console.error('Token refresh failed in getCurrentUser');
            return null;
          }
          
          // Retry with new token
          const retryResponse = await apiClient.get('/user', {
            headers: { 'Authorization': `Bearer ${newToken}` }
          });
          return retryResponse.data;
        } catch (refreshError) {
          console.error('Retry after refresh failed:', refreshError);
          return null;
        }
      }
      if (error.response?.status === 401) {
        return null;
      }
      throw handleError(error);
    }
  },
  
  async forceTokenRefresh() {
    try {
      return await refreshAccessToken();
    } catch (error) {
      console.error('Force refresh failed:', error);
      throw error;
    }
  },
  
  isAuthenticated() {
    if (accessToken) {
      try {
        const tokenData = parseJwt(accessToken);
        // Check if token is valid and not expired
        return tokenData && tokenData.exp && (tokenData.exp * 1000 > Date.now());
      } catch (e) {
        return false;
      }
    }
    return false;
  },

  setAccessToken(token) {
    accessToken = token;
    if (token) {
      setupRefreshTimer(token);
    }
  },
};

// Error handler utility for cleaner code
function handleError(error) {
  console.error('API Error:', error);
  if (error.response) {
    return new Error(error.response.data?.message || error.response.statusText);
  } else if (error.request) {
    return new Error('No response from server');
  } else {
    return new Error(error.message || 'API request failed');
  }
}

export { apiClient };