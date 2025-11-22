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
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <div className="flex max-w-full flex-col items-center gap-4 rounded-lg border border-orange-200 bg-orange-50/50 p-8 text-center">
          <img
            src="https://res.cloudinary.com/djwpst00v/image/upload/v1763789403/13379593_5219088_iajsfa.svg"
            alt="question"
            className="size-96 rounded-full"
          />
          <h3 className="text-lg font-semibold text-red-900">
            Unable to Load Post
          </h3>
          <p className="text-sm text-orange-700">
            This post might not exist, or you may not have access to it. Please
            make sure you've joined the community or try refreshing the page.
          </p>
        </div>
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
            <div className="flex flex-1 flex-col gap-8">
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
