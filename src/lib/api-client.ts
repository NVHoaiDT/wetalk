import Axios, { InternalAxiosRequestConfig } from 'axios';

import { useNotifications } from '@/components/ui/notifications';
import { env } from '@/config/env';
import { paths } from '@/config/paths';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';

    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  config.withCredentials = true;

  const url = `${config.baseURL || ''}${config.url}`;
  const params = config.params
    ? `?${new URLSearchParams(config.params as Record<string, string>).toString()}`
    : '';

  console.log('[API Request]:', `${url}${params}`);
  return config;
}

export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const message = error.response?.data?.message || error.message;

    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Reminder',
      message,
    });

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log('Unauthorized, attempting to refresh token');

      try {
        const response = await Axios.post(
          `${env.API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );

        console.log('Token refresh response:', response);

        const newAccessToken = response.data?.data?.accessToken;

        if (newAccessToken) {
          console.log(
            'Token refreshed successfully, retrying original request',
          );
          localStorage.setItem('accessToken', newAccessToken);

          // Update the authorization header with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.log('Token refresh failed, redirecting to login');
        console.error(refreshError);

        localStorage.removeItem('accessToken');

        const currentPath = window.location.pathname;

        // if (!currentPath.startsWith('/auth')) {
        //   window.location.href = paths.auth.login.getHref(currentPath);
        // }
        // return Promise.reject(refreshError);
        return null;
      }
    }

    return Promise.reject(error);
  },
);

/* ____________________TEST ____________________ */
export const apiMedia = Axios.create({
  baseURL: env.API_MEDIA_URL,
});

apiMedia.interceptors.request.use(authRequestInterceptor);

apiMedia.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response?.status === 500) {
      window.location.href = paths.app.notFound.path;
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log('Unauthorized (Media API), attempting to refresh token');

      try {
        const response = await Axios.post(
          `${env.API_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          },
        );

        const newAccessToken = response.data?.data?.accessToken;

        if (newAccessToken) {
          console.log('Token refreshed successfully, retrying media request');
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiMedia(originalRequest);
        }
      } catch (refreshError) {
        console.log('Token refresh failed (Media API), redirecting to login');
        localStorage.removeItem('accessToken');

        const currentPath = window.location.pathname;

        if (!currentPath.startsWith('/auth')) {
          window.location.href = paths.auth.login.getHref(currentPath);
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const apiAI = Axios.create({
  baseURL: env.API_AI_URL,
});

apiAI.interceptors.request.use(authRequestInterceptor);

apiAI.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response?.status === 500) {
      window.location.href = paths.app.notFound.path;
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log('Unauthorized (AI API), attempting to refresh token');

      try {
        const response = await Axios.post(
          `${env.API_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          },
        );

        const newAccessToken = response.data?.data?.accessToken;

        if (newAccessToken) {
          console.log('Token refreshed successfully, retrying AI request');
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiAI(originalRequest);
        }
      } catch (refreshError) {
        console.log('Token refresh failed (AI API), redirecting to login');
        localStorage.removeItem('accessToken');

        const currentPath = window.location.pathname;

        if (!currentPath.startsWith('/auth')) {
          window.location.href = paths.auth.login.getHref(currentPath);
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// ---------------------
export const apiAcademy = Axios.create({
  baseURL: env.API_ACADEMY_URL,
});

apiAcademy.interceptors.request.use(authRequestInterceptor);

apiAcademy.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const message = error.response?.data?.message || error.message;

    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Reminder',
      message,
    });

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log('Unauthorized (Academy API), attempting to refresh token');

      try {
        const response = await Axios.post(
          `${env.API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );

        console.log('Token refresh response:', response);

        const newAccessToken = response.data?.data?.accessToken;

        if (newAccessToken) {
          console.log(
            'Token refreshed successfully, retrying original request',
          );
          localStorage.setItem('accessToken', newAccessToken);

          // Update the authorization header with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Retry the original request
          return apiAcademy(originalRequest);
        }
      } catch (refreshError) {
        console.log('Token refresh failed (Academy API), redirecting to login');
        console.error(refreshError);

        localStorage.removeItem('accessToken');

        const currentPath = window.location.pathname;

        // if (!currentPath.startsWith('/auth')) {
        //   window.location.href = paths.auth.login.getHref(currentPath);
        // }
        // return Promise.reject(refreshError);
        return null;
      }
    }

    return Promise.reject(error);
  },
);
