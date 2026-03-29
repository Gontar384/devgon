import axios from 'axios';

/**
 * Axios instance with credentials enabled and a global 401 interceptor.
 * On any 401 response, redirects to "/" — mirrors the behavior of
 * AppGraphQLClient.requestWithRedirect for REST endpoints.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export default api;
