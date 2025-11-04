import { ProfileCommentsList } from './profile-comments-list';
import { ProfileOverview } from './profile-overview';
import { ProfilePostsList } from './profile-posts-list';
import { TabType } from './profile-tabs';

type ProfileContentProps = {
  userId: number;
  activeTab: TabType;
};

export const ProfileContent = ({ userId, activeTab }: ProfileContentProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ProfileOverview userId={userId} />;
      case 'posts':
        return <ProfilePostsList userId={userId} />;
      case 'comments':
        return <ProfileCommentsList userId={userId} />;
      case 'saved':
      case 'history':
      case 'hidden':
      case 'upvoted':
      case 'downvoted':
        return (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-600">This feature is coming soon!</p>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="py-4">{renderContent()}</div>;
};
