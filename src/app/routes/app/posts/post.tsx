import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import { CreatePostComment } from '@/features/post-comments/components/create-post-comment';
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
      <ContentLayout>
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          <PostView id={post.id} />

          <CreatePostComment postId={post.id} />

          <ErrorBoundary
            fallback={
              <div>Failed to load comments. Try to refresh the page.</div>
            }
          >
            <PostCommentsList postId={post.id} />
          </ErrorBoundary>
        </div>
      </ContentLayout>
    </>
  );
};

export default PostRoute;
