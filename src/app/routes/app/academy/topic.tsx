import { useParams } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { TopicView } from '@/features/academy/components/topic-view';

const TopicRoute = () => {
  const params = useParams();
  const topicSlug = params.topicSlug as string;

  return (
    <ContentLayout>
      <TopicView topicSlug={topicSlug} />
    </ContentLayout>
  );
};

export default TopicRoute;
