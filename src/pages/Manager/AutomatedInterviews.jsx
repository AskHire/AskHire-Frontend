import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";

const AutomatedInterviews = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const vacancy = params.get('vacancy');

  return (
    <div>AutomatedInterviews</div>
  )
}

export default AutomatedInterviews