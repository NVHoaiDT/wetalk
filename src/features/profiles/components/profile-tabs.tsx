import { cn } from '@/utils/cn';

type TabType =
  | 'overview'
  | 'communities'
  | 'posts'
  | 'comments'
  | 'saved'
  | 'followed'
  | 'upvoted'
  | 'downvoted';

type ProfileTabsProps = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isOwnProfile?: boolean;
};

const tabs: { id: TabType; label: string; requiresOwn?: boolean }[] = [
  /* { id: 'overview', label: 'Overview' }, */
  { id: 'communities', label: 'Communities' },
  { id: 'posts', label: 'Posts' },
  { id: 'comments', label: 'Comments' },
  { id: 'saved', label: 'Saved', requiresOwn: true },
  { id: 'followed', label: 'Followed', requiresOwn: true },
];

export const ProfileTabs = ({
  activeTab,
  onTabChange,
  isOwnProfile,
}: ProfileTabsProps) => {
  const visibleTabs = tabs.filter((tab) => !tab.requiresOwn || isOwnProfile);

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex space-x-1 overflow-x-auto px-4 sm:space-x-2">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors sm:px-4',
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export type { TabType };
