import { TrendingUp, Users, ShieldBan } from 'lucide-react';

import { MDPreview } from '@/components/ui/md-preview';
import { formatBigNumber } from '@/utils/format';

interface CommunityCardProps {
  name: string;
  shortDescription: string;
  description: string;
  communityAvatar: string;
  isPrivate: boolean;
  totalMembers: number;
  rank: number;
}

const CommunityCard = ({
  name,
  shortDescription,
  communityAvatar,
  isPrivate,
  totalMembers,
  rank,
}: CommunityCardProps) => {
  // Define color schemes for top 3 ranks
  const getRankColors = () => {
    switch (rank) {
      case 1:
        return {
          border: 'border-yellow-200/70',
          bgGradient: 'from-yellow-100/10 to-amber-50/40',
          hoverShadow: 'hover:shadow-yellow-500/20',
          hoverGradient:
            'group-hover:from-yellow-300/10 group-hover:via-amber-300/10 group-hover:to-yellow-400/10',
          badgeGradient: 'from-yellow-400 to-amber-500',
          ringColor: 'ring-yellow-300',
          hoverRing: 'group-hover:ring-yellow-400',
          glowColor: 'bg-yellow-400',
          accentGradient: 'from-yellow-400 via-amber-500 to-yellow-600',
          textHover: 'group-hover:text-yellow-600',
          iconColor: 'text-yellow-500',
        };
      case 2:
        return {
          border: 'border-gray-200/100',
          bgGradient: 'from-gray-300/50 to-slate-50/40',
          hoverShadow: 'hover:shadow-gray-400/20',
          hoverGradient:
            'group-hover:from-gray-400/10 group-hover:via-slate-400/10 group-hover:to-gray-500/10',
          badgeGradient: 'from-gray-400 to-slate-500',
          ringColor: 'ring-gray-200',
          hoverRing: 'group-hover:ring-slate-300',
          glowColor: 'bg-gray-400',
          accentGradient: 'from-gray-400 via-slate-400 to-gray-500',
          textHover: 'group-hover:text-gray-700',
          iconColor: 'text-gray-500',
        };
      case 3:
        return {
          border: 'border-gray-200/100',
          bgGradient: 'from-gray-300/50 to-slate-50/40',
          hoverShadow: 'hover:shadow-gray-400/20',
          hoverGradient:
            'group-hover:from-gray-400/10 group-hover:via-slate-400/10 group-hover:to-gray-500/10',
          badgeGradient: 'from-gray-400 to-slate-500',
          ringColor: 'ring-gray-200',
          hoverRing: 'group-hover:ring-slate-300',
          glowColor: 'bg-gray-400',
          accentGradient: 'from-gray-400 via-slate-400 to-gray-500',
          textHover: 'group-hover:text-gray-700',
          iconColor: 'text-gray-500',
        };
      default:
        return {
          border: 'border-gray-200',
          bgGradient: 'from-white to-blue-50/30',
          hoverShadow: 'hover:shadow-blue-500/10',
          hoverGradient:
            'group-hover:from-blue-500/5 group-hover:via-blue-400/5 group-hover:to-blue-600/5',
          badgeGradient: 'from-blue-400 to-blue-500',
          ringColor: 'ring-blue-200',
          hoverRing: 'group-hover:ring-blue-300',
          glowColor: 'bg-blue-400',
          accentGradient: 'from-blue-400 via-blue-500 to-blue-600',
          textHover: 'group-hover:text-blue-600',
          iconColor: 'text-blue-500',
        };
    }
  };

  const colors = getRankColors();

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.bgGradient} shadow-sm transition-all duration-300 hover:shadow-xl ${colors.hoverShadow}`}
    >
      {/* Animated background gradient on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-400/0 to-blue-600/0 transition-all duration-500 ${colors.hoverGradient}`}
      />

      {/* Rank badge */}
      <div
        className={`absolute -left-1 -top-1 flex size-10 items-center justify-center rounded-br-2xl rounded-tl-2xl bg-gradient-to-br ${colors.badgeGradient} shadow-lg`}
      >
        <span className="text-sm font-bold text-white">{rank}</span>
      </div>

      <div className="relative flex items-center gap-2 p-4">
        {/* Avatar with glow effect */}
        <div className="relative shrink-0">
          <div
            className={`absolute inset-0 rounded-full ${colors.glowColor} opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40`}
          />
          <div
            className={`relative size-14 overflow-hidden rounded-full ring-2 ${colors.ringColor} transition-all duration-300 group-hover:ring-4 ${colors.hoverRing}`}
          >
            <img
              src={
                communityAvatar ||
                'https://styles.redditmedia.com/t5_2qh4j/styles/communityIcon_jxbrkfsppv481.png?width=64&height=64&frame=1&auto=webp&crop=64:64,smart&s=4e1ef144d22357320d937c4218f90381d07c04d6'
              }
              alt={name}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full border-2 border-white bg-green-500 shadow-sm" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h5
                className={`truncate text-sm font-bold text-gray-700 transition-colors duration-300 ${colors.textHover}`}
              >
                w/{name}
              </h5>
              <TrendingUp
                className={`size-3.5 ${colors.iconColor} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
            </div>
            {isPrivate && (
              <ShieldBan className={`size-3.5 ${colors.iconColor}`} />
            )}
          </div>
          <MDPreview
            value={shortDescription}
            maxLines={3}
            className="mb-2 line-clamp-2 min-h-8 text-xs leading-snug text-gray-600"
          />

          {/* Stats bar */}
          <div className="text-xs">
            <div className="flex justify-end gap-1.5 text-gray-500">
              <Users className={`size-3.5 ${colors.iconColor}`} />
              <span className="font-semibold text-gray-700">
                {formatBigNumber(totalMembers)}
              </span>
              <span>members</span>
            </div>
          </div>
        </div>

        {/* Hover arrow */}
        <div className="shrink-0 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <div
            className={`flex size-4 items-center justify-center rounded-full ${colors.iconColor.replace('text-', 'bg-')} shadow-lg`}
          >
            <svg
              className="size-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={`absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r ${colors.accentGradient} transition-transform duration-500 group-hover:scale-x-100`}
      />
    </div>
  );
};

export { CommunityCard };
