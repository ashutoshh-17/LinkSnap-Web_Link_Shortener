
// Configuration for API endpoints
// Change this URL when deploying to production
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  ENDPOINTS: {
    LOGIN: '/api/auth/public/login',
    REGISTER: '/api/auth/public/register',
    SHORTEN_URL: '/api/urls/shorten',
    MY_URLS: '/api/urls/myurls'
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
