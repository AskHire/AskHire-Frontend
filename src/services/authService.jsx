import axios from 'axios';

const API_URL = 'http://localhost:5190/api/Auth';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

let accessToken = null;
let refreshTokenTimeoutId = null;

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
          return cookieValue;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error reading cookie:', error);
    return null;
  }
};

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

const setupRefreshTimer = (token) => {
  try {
    if (!token) return;

    if (refreshTokenTimeoutId) {
      clearTimeout(refreshTokenTimeoutId);
    }

    const tokenData = parseJwt(token);
    if (!tokenData || !tokenData.exp) return;

    const expiresIn = (tokenData.exp * 1000) - Date.now() - 120000;

    if (expiresIn <= 0) {
      console.log('Token already expired or near expiration, refreshing now...');
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

const refreshAccessToken = async () => {
  try {
    console.log('Attempting to refresh access token...');

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

      setupRefreshTimer(accessToken);

      return accessToken;
    } else {
      console.warn('Refresh response did not contain accessToken:', response.data);
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('auth:tokenRefreshFailed', { detail: { message: 'Refresh token response missing access token.' } }));
      }
      return null;
    }
  } catch (error) {
    console.error('Refresh token failed:', error);
    accessToken = null;
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('auth:tokenRefreshFailed', { detail: { message: error.response?.data?.detail || 'Failed to refresh session.' } }));
    }
    throw error;
  }
};

const initializeTokenFromCookies = () => {
  const token = getCookie('jwt');
  if (token) {
    accessToken = token;
    setupRefreshTimer(token);
  }
};

initializeTokenFromCookies();

apiClient.interceptors.request.use(
  config => {
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
        setupRefreshTimer(token);
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

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

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (originalRequest.url === '/refresh-token' || originalRequest.skipAuthRefresh) {
      if (error.response?.status === 401) {
        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('auth:tokenRefreshFailed', { detail: { message: error.response?.data?.detail || 'Session refresh failed unexpectedly.' } }));
        }
      }
      return Promise.reject(error);
    }

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
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

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();

        if (!newToken) {
          throw new Error('Failed to get new token during refresh');
        }

        accessToken = newToken;
        processQueue(null, newToken);

        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);

        if (window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('auth:tokenRefreshFailed', { detail: { message: err.message || 'Authentication session ended.' } }));
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async register(userData) {
    try {
      const response = await apiClient.post('/register', userData);
      return response.data;
    } catch (error) {
      throw handleError(error, 'Registration failed.');
    }
  },

  async login(credentials) {
    try {
      const response = await apiClient.post('/login', credentials);

      if (response.data && response.data.accessToken) {
        accessToken = response.data.accessToken;
        setupRefreshTimer(accessToken);
      } else {
        const cookieToken = getCookie('jwt');
        if (cookieToken) {
          accessToken = cookieToken;
          setupRefreshTimer(cookieToken);
        }
      }

      console.log('Login successful, tokens set up');
      return response.data;
    } catch (error) {
      throw handleError(error, 'Login failed. Please check your credentials.');
    }
  },

  async logout() {
    try {
      if (refreshTokenTimeoutId) {
        clearTimeout(refreshTokenTimeoutId);
        refreshTokenTimeoutId = null;
      }
      accessToken = null;
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout failed on backend:', error);
      throw handleError(error, 'Logout failed.');
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
          const newToken = await refreshAccessToken();
          if (!newToken) {
            console.error('Token refresh failed in getCurrentUser - no new token obtained.');
            return null;
          }

          const retryResponse = await apiClient.get('/user', {
            headers: { 'Authorization': `Bearer ${newToken}` },
            skipAuthRefresh: true
          });
          return retryResponse.data;
        } catch (refreshError) {
          console.error('Retry after refresh failed in getCurrentUser:', refreshError);
          return null;
        }
      }
      if (error.response?.status === 401) {
        return null;
      }
      throw handleError(error, 'Failed to fetch current user data.');
    }
  },

  async forceTokenRefresh() {
    try {
      return await refreshAccessToken();
    } catch (error) {
      console.error('Force refresh failed:', error);
      throw handleError(error, 'Forced token refresh failed.');
    }
  },

  isAuthenticated() {
    if (accessToken) {
      try {
        const tokenData = parseJwt(accessToken);
        return tokenData && tokenData.exp && (tokenData.exp * 1000 > Date.now());
      } catch (e) {
        console.error('Error parsing token in isAuthenticated:', e);
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

  // --- New methods for Forgot Password feature ---
  async requestPasswordReset(email) {
    try {
      const response = await apiClient.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw handleError(error, 'Failed to request password reset link. Please try again.');
    }
  },

  async resetPassword(userId, token, newPassword, confirmNewPassword) {
    try {
      const response = await apiClient.post('/reset-password', { userId, token, newPassword, confirmNewPassword });
      return response.data;
    } catch (error) {
      throw handleError(error, 'Failed to reset password. The link might be invalid or expired, or your new password does not meet requirements.');
    }
  }
  // --- End new methods ---
};

function handleError(error, defaultMessage = 'An unexpected error occurred.') {
  console.error('API Error:', error);
  if (error.response) {
    if (error.response.data && error.response.data.detail) {
      return new Error(error.response.data.detail);
    }
    if (error.response.data && error.response.data.message) { // For your custom anonymous error objects
      return new Error(error.response.data.message);
    }
    if (error.response.data && typeof error.response.data === 'string') {
        return new Error(error.response.data);
    }
    if (error.response.statusText) {
      return new Error(error.response.statusText);
    }
    // Handle validation errors returned as ModelState dictionary (common from ASP.NET Core)
    if (error.response.data && typeof error.response.data === 'object') {
      const errors = [];
      for (const key in error.response.data) {
        if (Array.isArray(error.response.data[key])) {
          errors.push(...error.response.data[key]);
        } else if (typeof error.response.data[key] === 'string') {
          errors.push(error.response.data[key]);
        }
      }
      if (errors.length > 0) {
        return new Error(errors.join(' '));
      }
    }
    return new Error(defaultMessage);
  } else if (error.request) {
    return new Error('No response from server. Please check your internet connection or try again later.');
  } else {
    return new Error(error.message || defaultMessage);
  }
}

export { apiClient };