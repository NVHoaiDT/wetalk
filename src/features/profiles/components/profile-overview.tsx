import { ProfileCommentsList } from './profile-comments-list';
import { ProfilePostsList } from './profile-posts-list';

type ProfileOverviewProps = {
  userId: number;
};

export const ProfileOverview = ({ userId }: ProfileOverviewProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Recent Posts</h2>
        <ProfilePostsList userId={userId} />
      </div>
      <div>
        <h2 className="mb-4 text-lg font-bold text-gray-900">
          Recent Comments
        </h2>
        <ProfileCommentsList userId={userId} />
      </div>
    </div>
  );
};
