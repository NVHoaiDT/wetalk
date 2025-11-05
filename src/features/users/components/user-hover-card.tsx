import { format } from 'date-fns';
import { Link } from 'react-router';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';
import { useUser } from '@/lib/auth';

type UserHoverCardProps = {
  userId: number;
  children: React.ReactNode;
};

export const UserHoverCard = ({ userId, children }: UserHoverCardProps) => {
  const userQuery = useUser(userId);

  if (userQuery.isLoading || !userQuery.data) {
    return <Spinner />;
  }

  const userData = userQuery.data.data;

  return (
    <HoverCard openDelay={300} closeDelay={200}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        className="w-80"
        align="start"
        side="bottom"
        sideOffset={8}
      >
        <div className="flex flex-col gap-3">
          {/* Header with Avatar */}
          <div className="flex items-start gap-3">
            <Link
              to={paths.app.userProfile.getHref(userData.id)}
              className="shrink-0"
            >
              <img
                className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-md"
                src={userData.avatar}
                alt="User Avatar"
              />
            </Link>

            <div className="flex-1">
              <Link
                to={paths.app.userProfile.getHref(userData.id)}
                className="text-base font-bold text-gray-900 hover:text-blue-600"
              >
                w/{userData.username}
              </Link>
            </div>
          </div>

          <div className="flex flex-row gap-1">
            <p className="text-sm font-bold text-gray-600">
              {format(new Date(userData.createdAt), 'MMMM d, yyyy')}
            </p>
            •{' '}
            <p className="text-sm font-bold text-gray-600">
              {userData.achievement.karma} karma
            </p>
          </div>
          {/* Bio */}
          <p className="line-clamp-3 text-sm text-gray-700">{userData.bio}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
