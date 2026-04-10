import { useParams } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { LessonView } from '@/features/academy/components/lesson-view';

const LessonRoute = () => {
  const params = useParams();
  const topicSlug = params.topicSlug as string;
  const lessonSlug = params.lessonSlug as string;

  return (
    <ContentLayout>
      <LessonView topicSlug={topicSlug} lessonSlug={lessonSlug} />
    </ContentLayout>
  );
};

export default LessonRoute;
