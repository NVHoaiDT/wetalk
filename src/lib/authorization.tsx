import * as React from 'react';

import { fancyLog } from '@/helper/fancy-log';
import { Comment, User } from '@/types/api';

import { useCurrentUser } from './auth';

export enum ROLES {
  admin = 'admin',
  user = 'user',
}

type RoleTypes = keyof typeof ROLES;

export const POLICIES = {
  'comment:delete': (user: User, comment: Comment) => {
    if (user.role === ROLES.admin || comment.author?.id === user.id) {
      return true;
    }
    return false;
  },
  'post:create': (isFollow: boolean) => {
    fancyLog('Policy Check - post:create - isFollow:', isFollow);
    return isFollow;
  },
};

export const useAuthorization = () => {
  const userQuery = useCurrentUser();
  const user = userQuery.data?.data;

  if (!user) {
    throw Error('User does not exist!');
  }

  const checkAccess = React.useCallback(
    ({ allowedRoles }: { allowedRoles: RoleTypes[] }) => {
      if (allowedRoles && allowedRoles.length > 0 && user) {
        return allowedRoles?.includes(user.role as RoleTypes);
      }

      return true;
    },
    [user],
  );

  return { checkAccess, role: user.role };
};

type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode;
  children: React.ReactNode;
} & (
  | {
      allowedRoles: RoleTypes[];
      policyCheck?: never;
    }
  | {
      allowedRoles?: never;
      policyCheck: boolean;
    }
);

export const Authorization = ({
  policyCheck,
  allowedRoles,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { checkAccess } = useAuthorization();

  let canAccess = false;

  if (allowedRoles) {
    canAccess = checkAccess({ allowedRoles });
  }

  if (typeof policyCheck !== 'undefined') {
    canAccess = policyCheck;
  }

  return <>{canAccess ? children : forbiddenFallback}</>;
};
