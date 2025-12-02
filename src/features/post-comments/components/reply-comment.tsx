import { MessageCircleReply } from 'lucide-react';
import { Link } from 'react-router';

import { ConfirmationDialog } from '@/components/ui/dialog';
import { paths } from '@/config/paths';
import { ProtectedAction } from '@/lib/auth';

type ReplyCommentProps = {
  onReply: () => void;
  isReplying: boolean;
};

export const ReplyCommentFallback = ({
  onReply,
  isReplying,
}: ReplyCommentProps) => {
  return (
    <button
      className="flex h-8 flex-row content-center items-center px-2 text-gray-600 hover:text-blue-600"
      onClick={onReply}
    >
      <MessageCircleReply className={'mr-1 size-4'} />
      {isReplying ? 'Cancel' : 'Reply'}
    </button>
  );
};

export const UnauthenticatedFallback = () => {
  return (
    <ConfirmationDialog
      icon="info"
      title="Join the discussion!"
      body="Sign up to reply to comments and engage with the community."
      illustration="https://res.cloudinary.com/djwpst00v/image/upload/v1763795804/comment_v2xjak.jpg"
      triggerButton={
        <button className="flex h-8 flex-row content-center items-center px-2 text-gray-600 hover:text-blue-600">
          <MessageCircleReply className={'mr-1 size-4'} />
          Reply
        </button>
      }
      confirmButton={
        <Link
          to={paths.auth.register.getHref(location.pathname)}
          replace
          className="inline-block rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Sign up
        </Link>
      }
    ></ConfirmationDialog>
  );
};

export const ReplyComment = ({ onReply, isReplying }: ReplyCommentProps) => {
  return (
    <ProtectedAction
      authenticatedFallback={
        <ReplyCommentFallback onReply={onReply} isReplying={isReplying} />
      }
      unauthenticatedFallback={<UnauthenticatedFallback />}
    />
  );
};
