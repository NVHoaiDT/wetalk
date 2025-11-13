import { useParams } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import { useCommunity } from '@/features/communities/api/get-community';
import { CommunitySidebar } from '@/features/communities/components/community-sidebar';
import { CreatePostComment } from '@/features/post-comments/components/create-post-comment';
import { PostCommentsList } from '@/features/post-comments/components/post-comments-list';
import { usePost } from '@/features/posts/api/get-post';
import { PostView } from '@/features/posts/components/post-view';
import { fancyLog } from '@/helper/fancy-log';

const PostRoute = () => {
  const params = useParams();
  const postId = params.postId as string;

  const postQuery = usePost({
    id: Number(postId),
  });

  /* 
    Annoying situation here:
    We need to fetch the community data based on the post's communityId but we can't do it until we have the post data.
    So we use the enabled option to only fetch the community once we have the post data available.
    Change the path to inclue communityId is not a good idea because post can be accessed directly via link without community context.
  */
  const communityQuery = useCommunity({
    communityId: postQuery?.data?.data?.community.id,
    queryConfig: {
      enabled: !!postQuery?.data?.data?.community.id,
    },
  });

  if (postQuery.isLoading || communityQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (postQuery.isError || communityQuery.isError) {
    return (
      <div className="flex h-48 w-full items-center justify-center text-red-500">
        Error loading post.
      </div>
    );
  }

  if (!postQuery.data) {
    return <div>post break the page</div>;
  }
  if (!communityQuery.data) {
    return <div>community break the page</div>;
    /* This one displayed !!! */
  }

  const post = postQuery.data?.data;
  const community = communityQuery.data?.data;

  fancyLog('Post Data:', post);
  fancyLog('Community Data:', community);
  return (
    <>
      <ContentLayout>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <div className="flex w-full justify-between gap-6">
            <div className="flex flex-col gap-8">
              <PostView id={post.id} />
              <CreatePostComment postId={post.id} />
              <PostCommentsList postId={post.id} />
            </div>

            <div className="w-80 lg:block">
              <div className="sticky top-6 flex justify-center">
                <CommunitySidebar community={community} />
              </div>
            </div>
          </div>
        </div>
      </ContentLayout>
    </>
  );
};

export default PostRoute;
