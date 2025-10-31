import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import { PostCommentsList } from '@/features/post-comments/components/post-comments-list';
import { usePost } from '@/features/posts/api/get-post';
import { PostView } from '@/features/posts/components/post-view';

const PostRoute = () => {
  const params = useParams();
  const postId = params.postId as string;
  const postQuery = usePost({
    id: Number(postId),
  });

  if (postQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const post = postQuery.data?.data;

  if (!post) return null;

  return (
    <>
      <ContentLayout title={post.title}>
        <PostView id={post.id} />
        <div className="mt-8">
          <ErrorBoundary
            fallback={<div>Failed to load post. Try to refresh the page.</div>}
          ></ErrorBoundary>
          <PostCommentsList postId={post.id} />
        </div>
      </ContentLayout>
    </>
  );
};

export default PostRoute;
