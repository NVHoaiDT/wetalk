import { Spinner } from '@/components/ui/spinner';
import { fancyLog } from '@/helper/fancy-log';

import { usePost } from '../api/get-post';

export const PostView = ({ id }: { id: number }) => {
  const postQuery = usePost({ id });

  if (postQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const post = postQuery?.data?.data;

  if (!post) return null;
  fancyLog('PostView-Post:', post);
  /* 
    {
        "id": 25,
        "community": {
            "id": 31,
            "name": "Code Review Club"
        },
        "author": {
            "id": 25,
            "username": "tranthib",
            "avatar": "https://i.pravatar.cc/150?img=2"
        },
        "title": "Code Review Checklist - Visual Guide",
        "type": "media",
        "content": "<h2>📋 Comprehensive Code Review Checklist</h2>\r\n<p>Mình tạo một bộ visual checklist cho code review process, cover:</p>\r\n<ol>\r\n<li><strong>Code Quality:</strong> Readability, naming conventions, complexity</li>\r\n<li><strong>Logic & Bugs:</strong> Edge cases, error handling, race conditions</li>\r\n<li><strong>Performance:</strong> Algorithm efficiency, database queries, memory leaks</li>\r\n<li><strong>Security:</strong> Input validation, authentication, data exposure</li>\r\n<li><strong>Testing:</strong> Test coverage, test quality, edge case handling</li>\r\n<li><strong>Documentation:</strong> Comments, README, API docs</li>\r\n</ol>\r\n<p>Print ra dán tường hoặc save làm reference nhé! 📌</p>",
        "mediaUrls": [
            "https://picsum.photos/seed/checklist1/800/1200",
            "https://picsum.photos/seed/checklist2/800/1200"
        ],
        "tags": [
            "code-review",
            "best-practices",
            "quality",
            "checklist"
        ],
        "vote": 6,
        "createdAt": "2025-10-20T03:59:01.860759Z",
        "updatedAt": "2025-10-21T03:59:01.860759Z"
    }
  */
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
};
