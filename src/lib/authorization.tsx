import * as React from 'react';

import { fancyLog } from '@/helper/fancy-log';
import { Comment, Moderators, User } from '@/types/api';

import { useCurrentUser } from './auth';

export enum ROLES {
  superAdmin = 'super_admin',
  moderator = 'moderator',
  user = 'user',
}
type RoleTypes = keyof typeof ROLES;

export const POLICIES = {
  'comment:delete': (user: User, comment: Comment) => {
    fancyLog('Policy Check - comment:delete - user:', user);
    return user.role === ROLES.superAdmin || comment.author?.id === user.id;
  },
  'post:create': (isFollow: boolean) => {
    fancyLog('Policy Check - post:create - isFollow:', isFollow);
    return isFollow;
  },
  'community:moderate': (currentUser: User, moderators: Moderators[]) => {
    return moderators.some((mod) => mod.userId === currentUser.id);
  },
  'community:superAdmin': (currentUser: User, moderators: Moderators[]) => {
    /* Check for:
      - Moderators-list contains current user (match by `id`)
      - AND that `id` has role of `super_admin`       
    */
    return moderators.some(
      (mod) => mod.userId === currentUser.id && mod.role === ROLES.superAdmin,
    );
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
