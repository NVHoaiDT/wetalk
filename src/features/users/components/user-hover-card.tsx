import { format } from 'date-fns';
import { useState } from 'react';
import { Link } from 'react-router';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { paths } from '@/config/paths';
import { useUser } from '@/lib/auth';

type UserHoverCardProps = {
  userId: number;
  children: React.ReactNode;
};

export const UserHoverCard = ({ userId, children }: UserHoverCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const userQuery = useUser(userId, { enabled: isOpen });

  if (userQuery.isLoading || !userQuery.data) {
    return children;
  }

  const userData = userQuery.data.data;

  return (
    <HoverCard openDelay={300} closeDelay={200} onOpenChange={setIsOpen}>
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
                className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-semibold text-white shadow-md"
                src={
                  userData.avatar ||
                  'https://styles.redditmedia.com/t5_388p4/styles/communityIcon_hlczkoi3mr3d1.jpg?width=96&height=96&frame=1&auto=webp&crop=96%3A96%2Csmart&s=a46ae3b5bc59034a0365a38630faa863bd365ca0'
                }
                alt="User Avatar"
              />
            </Link>

            <div className="flex-1">
              <Link
                to={paths.app.userProfile.getHref(userData.id)}
                className="text-base text-gray-700 hover:text-blue-600"
              >
                w/{userData.username}
              </Link>

              <div className="flex flex-row gap-1">
                <p className="text-sm font-semibold text-gray-600">
                  {format(new Date(userData.createdAt), 'MMMM d, yyyy')}
                </p>
                •{' '}
                <p className="text-sm font-semibold text-gray-600">
                  {userData.achievement.karma} karma
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="line-clamp-3 text-sm text-gray-700">{userData.bio}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
