export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },

  auth: {
    register: {
      path: '/auth/register',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    verify: {
      path: '/auth/verify-result',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/verify-result${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    notify: {
      path: '/auth/notify',
      getHref: (email?: string | null | undefined) =>
        `/auth/notify${email ? `?email=${encodeURIComponent(email)}` : ''}`,
    },
    forgotPassword: {
      path: '/auth/forgot-password',
      getHref: () => '/auth/forgot-password',
    },
    resetPassword: {
      path: '/auth/reset-password',
      getHref: (token?: string | null | undefined) =>
        `/auth/reset-password${token ? `?token=${encodeURIComponent(token)}` : ''}`,
    },
  },

  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    dashboard: {
      path: '',
      getHref: () => '/app',
    },
    discussions: {
      path: 'discussions',
      getHref: () => '/app/discussions',
    },
    discussion: {
      path: 'discussions/:discussionId',
      getHref: (id: string | number) => `/app/discussions/${id}`,
    },
    communities: {
      path: 'communities',
      getHref: () => '/app/communities',
    },
    community: {
      path: 'communities/:communityId',
      getHref: (id: string | number) => `/app/communities/${id}`,
    },
    post: {
      path: 'posts/:postId',
      getHref: (id: string | number) => `/app/posts/${id}`,
    },
    search: {
      path: 'search/:query',
      /* Encode the query string latter */
      getHref: (query: string) => `/app/search/${query}`,
    },
    users: {
      path: 'users',
      getHref: (userId: string | number) => `/app/users/${userId}`,
    },
    profile: {
      path: 'profile',
      getHref: () => '/app/profile',
    },
    userProfile: {
      path: 'profiles/:userId',
      getHref: (userId: string | number) => `/app/profiles/${userId}`,
    },
    notifications: {
      path: 'notifications',
      getHref: () => '/app/notifications',
    },
    settings: {
      path: 'settings',
      getHref: () => '/app/settings',
    },
  },
} as const;
