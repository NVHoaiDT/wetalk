import { Award, Trophy, TrendingUp } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type BadgeHistoryDialogProps = {
  badges: Array<{
    badgeName: string;
    iconUrl: string;
    karma: number;
    monthYear: string;
  }>;
};

const getBadgeColor = (badgeName: string) => {
  const name = badgeName.toLowerCase();
  if (name.includes('bronze'))
    return 'from-orange-400 to-orange-600 border-orange-300';
  if (name.includes('silver'))
    return 'from-gray-400 to-gray-600 border-gray-300';
  if (name.includes('gold'))
    return 'from-yellow-400 to-yellow-600 border-yellow-300';
  if (name.includes('platinum'))
    return 'from-purple-400 to-purple-600 border-purple-300';
  if (name.includes('diamond'))
    return 'from-cyan-400 to-cyan-600 border-cyan-300';
  return 'from-blue-400 to-blue-600 border-blue-300';
};

export const BadgeHistoryDialog = ({ badges }: BadgeHistoryDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Sort badges by date (newest first) and karma
  const sortedBadges = [...badges].sort((a, b) => {
    // First try to parse dates
    const dateA = new Date(a.monthYear);
    const dateB = new Date(b.monthYear);

    // If dates are valid and different, sort by date
    if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
      return dateB.getTime() - dateA.getTime();
    }

    // Otherwise sort by karma
    return b.karma - a.karma;
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          icon={<Award className="size-4" />}
        >
          Achievements History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="size-6 text-amber-500" />
            Badge History
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Your achievement journey over time
          </p>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {sortedBadges.length === 0 ? (
            <div className="py-12 text-center">
              <Award className="mx-auto mb-4 size-16 text-gray-300" />
              <p className="text-gray-600">No badges earned yet</p>
              <p className="mt-2 text-sm text-gray-500">
                Keep contributing to earn your first badge!
              </p>
            </div>
          ) : (
            sortedBadges.map((badge, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm transition-all hover:shadow-md"
              >
                {/* Badge Rank Indicator */}
                {index === 0 && (
                  <div className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-2 py-1 text-xs font-bold text-white shadow-md">
                    Latest
                  </div>
                )}

                <div className="flex items-center gap-4">
                  {/* Badge Icon */}
                  <div
                    className={`flex size-16 shrink-0 items-center justify-center rounded-xl border-2 bg-gradient-to-br shadow-lg transition-transform group-hover:scale-105 ${getBadgeColor(badge.badgeName)}`}
                  >
                    <img
                      src={badge.iconUrl}
                      alt={badge.badgeName}
                      className="size-10"
                    />
                  </div>

                  {/* Badge Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {badge.badgeName}
                      </h3>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="size-3.5" />
                        {badge.karma.toLocaleString()} karma
                      </span>
                      <span>•</span>
                      <span>{badge.monthYear}</span>
                    </div>
                  </div>
                </div>

                {/* Progress indicator for visual appeal */}
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full bg-gradient-to-r ${getBadgeColor(badge.badgeName).split(' ')[0]} ${getBadgeColor(badge.badgeName).split(' ')[1]} transition-all`}
                    style={{
                      width: `${Math.min((badge.karma / 5000) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {sortedBadges.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">
                {sortedBadges.length}
              </div>
              <div className="text-xs text-gray-600">Total Badges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">
                {Math.max(...sortedBadges.map((b) => b.karma)).toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Peak Karma</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">
                {sortedBadges[0]?.badgeName || 'N/A'}
              </div>
              <div className="text-xs text-gray-600">Current Badge</div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
