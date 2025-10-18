import { ContentLayout } from '@/components/layouts';
import { CommunityView } from '@/features/communities/components/community-view';

const CommunityRoute = () => {
  return (
    <ContentLayout title="Community">
      <CommunityView></CommunityView>
    </ContentLayout>
  );
};

export default CommunityRoute;
