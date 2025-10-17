import Axios, { InternalAxiosRequestConfig } from 'axios';

import { useNotifications } from '@/components/ui/notifications';
import { env } from '@/config/env';
import { paths } from '@/config/paths';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';

    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  config.withCredentials = false;

  //Testing purposes
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
  (error) => {
    const message = error.response?.data?.message || error.message;
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');

      const currentPath = window.location.pathname;

      if (!currentPath.startsWith('/auth')) {
        window.location.href = paths.auth.login.getHref(currentPath);
      }
    } else {
      useNotifications.getState().addNotification({
        type: 'error',
        title: 'Error',
        message,
      });
    }

    return Promise.reject(error);
  },
);
