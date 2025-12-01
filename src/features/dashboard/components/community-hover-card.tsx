import { Users } from 'lucide-react';
import { Link } from 'react-router';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { paths } from '@/config/paths';
import { useCommunity } from '@/features/communities/api/get-community';
import { JoinCommunity } from '@/features/communities/components/join-community';
import { UnJoinCommunity } from '@/features/communities/components/unjoin-community';
import { formatBigNumber } from '@/utils/format';

type CommunityHoverCardProps = {
  communityId: number;
  communityName: string;
  children: React.ReactNode;
};

export const CommunityHoverCard = ({
  communityId,
  children,
}: CommunityHoverCardProps) => {
  const communityQuery = useCommunity({ communityId });

  if (communityQuery.isLoading || !communityQuery.data) {
    return <>{children}</>;
  }

  const communityData = communityQuery.data?.data;

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
              <img
                className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-md"
                src={
                  communityData.communityAvatar ||
                  'https://b.thumbs.redditmedia.com/J_fCwTYJkoM-way-eaOHv8AOHoF_jNXNqOvPrQ7bINY.png'
                }
                alt={communityData.name}
              ></img>
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
                  {formatBigNumber(communityData.totalMembers)} members
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="line-clamp-3 text-sm text-gray-700">
            {communityData.shortDescription}
          </p>

          {/* Join Button */}
          {communityData.isFollow ? (
            <UnJoinCommunity id={communityData.id} />
          ) : (
            <JoinCommunity id={communityData.id} />
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
