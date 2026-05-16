import { ContentLayout } from '@/components/layouts';
import { TopicsList } from '@/features/academy/components/topics-list';

const AcademyRoute = () => {
  return (
    <ContentLayout title="Academy">
      <TopicsList />
    </ContentLayout>
  );
};

export default AcademyRoute;
