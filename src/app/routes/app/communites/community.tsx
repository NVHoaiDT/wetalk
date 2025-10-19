import { useParams } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { CommunityView } from '@/features/communities/components/community-view';

const CommunityRoute = () => {
  const params = useParams();
  const communityId = params.communityId as string;
  return (
    <ContentLayout title="Community">
      <CommunityView communityId={communityId}></CommunityView>
    </ContentLayout>
  );
};

export default CommunityRoute;
