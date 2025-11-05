import { Users } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { paths } from '@/config/paths';
import { formatBigNumber } from '@/utils/format';

type CommunityHoverCardProps = {
  communityId: number;
  communityName: string;
  children: React.ReactNode;
};

// Mock data generator - will be replaced with real API call later
const getMockCommunityData = (communityId: number, communityName: string) => {
  return {
    id: communityId,
    name: communityName,
    avatar: communityName.charAt(0).toUpperCase(),
    description:
      'A community for discussing and sharing content about various topics.',
    memberCount: Math.floor(Math.random() * 100000) + 1000,
    isJoined: false,
  };
};

export const CommunityHoverCard = ({
  communityId,
  communityName,
  children,
}: CommunityHoverCardProps) => {
  const communityData = getMockCommunityData(communityId, communityName);

  const handleJoin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Join community:', communityId);
  };

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
              to={paths.app.community.getHref(communityData.id)}
              className="shrink-0"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-md">
                {communityData.avatar}
              </div>
            </Link>

            <div className="flex-1">
              <Link
                to={paths.app.community.getHref(communityData.id)}
                className="text-base font-bold text-gray-900 hover:text-blue-600"
              >
                w/{communityData.name}
              </Link>
              <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                <Users className="size-3.5" />
                <span>
                  {formatBigNumber(communityData.memberCount)} members
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="line-clamp-3 text-sm text-gray-700">
            {communityData.description}
          </p>

          {/* Join Button */}
          <Button
            onClick={handleJoin}
            className="w-full rounded-full bg-blue-600 font-semibold hover:bg-blue-700"
            size="sm"
          >
            {communityData.isJoined ? 'Joined' : 'Join Community'}
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
