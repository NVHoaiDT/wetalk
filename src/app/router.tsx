import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { paths } from '@/config/paths';

import {
  default as AppRoot,
  ErrorBoundary as AppRootErrorBoundary,
} from './routes/app/root';

const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('./routes/landing').then(convert(queryClient)),
    },
    {
      path: paths.auth.register.path,
      lazy: () => import('./routes/auth/register').then(convert(queryClient)),
    },
    {
      path: paths.auth.login.path,
      lazy: () => import('./routes/auth/login').then(convert(queryClient)),
    },
    {
      path: paths.auth.verify.path,
      lazy: () => import('./routes/auth/verify').then(convert(queryClient)),
    },
    {
      path: paths.auth.notify.path,
      lazy: () => import('./routes/auth/notify').then(convert(queryClient)),
    },
    {
      path: paths.auth.notifyResetPassword.path,
      lazy: () =>
        import('./routes/auth/notify-reset-password').then(
          convert(queryClient),
        ),
    },
    {
      path: paths.auth.forgotPassword.path,
      lazy: () =>
        import('./routes/auth/forgot-password').then(convert(queryClient)),
    },
    {
      path: paths.auth.resetPassword.path,
      lazy: () =>
        import('./routes/auth/reset-password').then(convert(queryClient)),
    },
    {
      path: paths.app.root.path,
      element: <AppRoot />,
      ErrorBoundary: AppRootErrorBoundary,
      children: [
        {
          path: paths.app.dashboard.path,
          lazy: () =>
            import('./routes/app/dashboard').then(convert(queryClient)),
        },
        {
          path: paths.app.communities.path,
          lazy: () =>
            import('./routes/app/communites/communites').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.app.community.path,
          lazy: () =>
            import('./routes/app/communites/community').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.app.post.path,
          lazy: () =>
            import('./routes/app/posts/post').then(convert(queryClient)),
        },
        {
          path: paths.app.search.path,
          lazy: () =>
            import('./routes/app/search/search').then(convert(queryClient)),
        },
        {
          path: paths.app.profile.path,
          lazy: () =>
            import('./routes/app/profiles/profile').then(convert(queryClient)),
        },
        {
          path: paths.app.userProfile.path,
          lazy: () =>
            import('./routes/app/profiles/user-profile').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.app.notifications.path,
          lazy: () =>
            import('./routes/app/notifications/notifications').then(
              convert(queryClient),
            ),
        },
        {
          path: paths.app.settings.path,
          lazy: () => import('./routes/app/setting').then(convert(queryClient)),
        },
      ],
    },
    {
      path: '*',
      lazy: () => import('./routes/not-found').then(convert(queryClient)),
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};
