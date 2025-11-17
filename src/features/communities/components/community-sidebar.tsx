import { Calendar, Globe, TrendingUp, MessageCircle } from 'lucide-react';
import { Link } from 'react-router';

import { paths } from '@/config/paths';
import { CreatePost } from '@/features/posts/components/create-post';
import { Community } from '@/types/api';
import { formatBigNumber } from '@/utils/format';

export const CommunitySidebar = ({ community }: { community: Community }) => {
  return (
    <aside className="w-80 space-y-4 self-start rounded-2xl">
      {/* About Community */}
      <div className="overflow-hidden border border-gray-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
          <h3 className="font-bold text-white">w/{community.name}</h3>
        </div>
        <div className="space-y-4 p-4">
          <p className="text-sm leading-relaxed text-gray-700">
            w/{community.name} - {community.shortDescription}
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="size-4" />
            {new Date(community.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            {community.isPrivate ? (
              <>
                <Globe className="size-4" />
                <span>Private</span>
              </>
            ) : (
              <>
                <Globe className="size-4" />
                <span>Public</span>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
            <div>
              <div className="text-xl font-bold text-gray-900">
                {formatBigNumber(community.totalMembers)}
              </div>
              <div className="text-xs text-gray-500">Members</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xl font-bold text-gray-900">
                {formatBigNumber(12000)}
                <TrendingUp className="size-4 text-green-500" />
              </div>
              <div className="text-xs text-gray-500">Weekly posts</div>
            </div>
          </div>

          <CreatePost communityId={community.id} />
        </div>
      </div>

      {/* Moderators */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <h3 className="text-sm font-bold text-gray-900">MODERATORS</h3>
        </div>
        <div className="p-4">
          <button className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-sm font-medium transition-colors hover:bg-gray-50">
            <MessageCircle className="size-4" />
            Message Mods
          </button>
          <div className="space-y-3">
            {community.moderators.map((mod, idx) => (
              <Link to={paths.app.userProfile.getHref(mod.userId)} key={idx}>
                <div className="flex cursor-pointer items-center gap-3 rounded-full p-2 transition-colors hover:border hover:border-blue-200 hover:bg-blue-50">
                  <img
                    src={
                      mod.avatar || 'https://avatar.iran.liara.run/public/17'
                    }
                    alt={mod.username}
                    className="size-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {mod.username}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500">
            <svg
              className="size-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="mb-1 text-sm font-semibold text-blue-900">
              Community Guidelines
            </h4>
            <p className="text-xs leading-relaxed text-blue-700">
              Please be respectful and constructive. Read our rules before
              posting.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
