import { TrendingUp, Users, ShieldBan } from 'lucide-react';

interface CommunityCardProps {
  name: string;
  shortDescription: string;
  description: string;
  coverImage: string;
  isPrivate: boolean;
  totalMembers: number;
}

const CommunityCard = ({
  name,
  shortDescription,
  description,
  coverImage,
  isPrivate,
  totalMembers,
}: CommunityCardProps) => {
  // Format member count (e.g., 67000000 -> 67M)
  const formatMembers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  console.log('==========Cover-Image: ', coverImage);
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-blue-100/50 bg-gradient-to-br from-white to-blue-50/30 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
      {/* Animated background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-400/0 to-blue-600/0 transition-all duration-500 group-hover:from-blue-500/5 group-hover:via-blue-400/5 group-hover:to-blue-600/5" />

      {/* Rank badge */}
      <div className="absolute -left-1 -top-1 flex size-10 items-center justify-center rounded-br-2xl rounded-tl-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
        <span className="text-sm font-bold text-white">{1}</span>
      </div>

      <div className="relative flex items-center gap-2 p-4">
        {/* Avatar with glow effect */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40" />
          <div className="relative size-14 overflow-hidden rounded-full ring-2 ring-blue-200 transition-all duration-300 group-hover:ring-4 group-hover:ring-blue-300">
            <img
              src={
                coverImage ||
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
              <h5 className="truncate text-sm font-bold text-gray-700 transition-colors duration-300 group-hover:text-blue-600">
                w/{name}
              </h5>
              <TrendingUp className="size-3.5 text-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            {isPrivate && <ShieldBan className="size-3.5 text-blue-500" />}
          </div>
          <p className="mb-2 line-clamp-2 text-xs leading-snug text-gray-600">
            {shortDescription}
          </p>

          {/* Stats bar */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Users className="size-3.5 text-blue-500" />
              <span className="font-semibold text-gray-700">
                {formatMembers(totalMembers)}
              </span>
              <span>members</span>
            </div>

            <div className="size-1 rounded-full bg-gray-300" />

            <div className="rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-700">
              {'Category'}
            </div>
          </div>
        </div>

        {/* Hover arrow */}
        <div className="shrink-0 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <div className="flex size-4 items-center justify-center rounded-full bg-blue-500 shadow-lg">
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
      <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 transition-transform duration-500 group-hover:scale-x-100" />
    </div>
  );
};

export { CommunityCard };
