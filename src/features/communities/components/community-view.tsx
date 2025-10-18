import {
  Plus,
  Calendar,
  Globe,
  MoreHorizontal,
  TrendingUp,
  MessageCircle,
  Share2,
  Bookmark,
} from 'lucide-react';
import React from 'react';

export const CommunityView = () => {
  const mockCommunity = {
    name: 'SideProject',
    shortDescription: 'A community for sharing side projects',
    description:
      'r/SideProject is a subreddit for sharing and receiving constructive feedback on side projects.',
    coverImage:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=300&fit=crop',
    avatar:
      'https://images.unsplash.com/photo-1558655146-d09347e92766?w=100&h=100&fit=crop',
    isPrivate: false,
    totalMembers: 330000,
    weeklyContributions: 10000,
    createdDate: 'Jan 17, 2013',

    posts: [
      {
        id: 1,
        userName: 'u/officer_KD6-3-7',
        timeAgo: '4 mo. ago',
        title:
          'I wrote a 680-page Interactive Book on Computer Science Algorithms',
        coverImage:
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop',
        upvotes: 6100,
        comments: 867,
        awards: 7,
      },
      {
        id: 2,
        userName: 'u/alexandro',
        timeAgo: '2 days ago',
        title: 'Built a real-time collaboration tool for remote teams',
        coverImage:
          'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop',
        upvotes: 4200,
        comments: 523,
        awards: 4,
      },
      {
        id: 3,
        userName: 'u/developer_jane',
        timeAgo: '1 week ago',
        title: 'Launched my indie SaaS - From idea to $10K MRR',
        coverImage:
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
        upvotes: 8900,
        comments: 1240,
        awards: 12,
      },
    ],

    moderators: [
      {
        name: 'u/MurtzaM',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
      },
      {
        name: 'u/walruswilderness',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop',
      },
    ],
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Cover Banner */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
        <div className="absolute inset-0 opacity-20">
          <img
            src={mockCommunity.coverImage}
            alt="Cover"
            className="size-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Header Section */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6">
          <div className="-mt-6 flex items-end gap-6 pb-4">
            {/* Avatar */}
            <div className="relative">
              <div className="size-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
                <img
                  src={mockCommunity.avatar}
                  alt={mockCommunity.name}
                  className="size-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 size-7 rounded-full border-4 border-white bg-green-500" />
            </div>

            {/* Title and Actions */}
            <div className="flex flex-1 items-end justify-between pb-1">
              <div>
                <h1 className="mb-1 text-3xl font-bold text-gray-900">
                  r/{mockCommunity.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {mockCommunity.shortDescription}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button className="group relative flex items-center gap-2 rounded-full border-2 border-blue-600 bg-white px-5 py-2.5 font-semibold text-blue-600 shadow-sm transition-all duration-300 hover:bg-blue-50 hover:shadow-md">
                  <Plus className="size-4" />
                  Create Post
                </button>
                <button className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/40">
                  Join
                </button>
                <button className="flex size-10 items-center justify-center rounded-full border border-gray-300 transition-colors duration-200 hover:bg-gray-50">
                  <MoreHorizontal className="size-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-8 border-t border-gray-100 text-sm font-medium">
            <button className="border-b-2 border-blue-600 px-1 py-3 text-blue-600">
              Posts
            </button>
            <button className="px-1 py-3 text-gray-500 transition-colors hover:text-gray-900">
              About
            </button>
            <button className="px-1 py-3 text-gray-500 transition-colors hover:text-gray-900">
              Rules
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl p-6">
        <div className="flex gap-6">
          {/* Posts Area */}
          <div className="flex-1 space-y-4">
            {mockCommunity.posts.map((post) => (
              <article
                key={post.id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg"
              >
                <div className="flex">
                  {/* Vote Section */}
                  <div className="flex w-12 flex-col items-center gap-1 border-r border-gray-200 bg-gray-50 py-3">
                    <button className="rounded p-1 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600">
                      <svg
                        className="size-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 3l6 6H4l6-6z" />
                      </svg>
                    </button>
                    <span className="text-xs font-bold text-gray-700">
                      {formatNumber(post.upvotes)}
                    </span>
                    <button className="rounded p-1 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600">
                      <svg
                        className="size-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 17l-6-6h12l-6 6z" />
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
                        <span className="cursor-pointer font-medium text-gray-900 hover:text-blue-600">
                          {post.userName}
                        </span>
                        <span>•</span>
                        <span>{post.timeAgo}</span>
                      </div>

                      <h2 className="mb-3 cursor-pointer text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                        {post.title}
                      </h2>

                      {post.coverImage && (
                        <div className="mb-3 overflow-hidden rounded-lg">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button className="flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100">
                          <MessageCircle className="size-4" />
                          <span>{post.comments} Comments</span>
                        </button>
                        <button className="flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100">
                          <Share2 className="size-4" />
                          <span>Share</span>
                        </button>
                        <button className="flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-gray-100">
                          <Bookmark className="size-4" />
                          <span>Save</span>
                        </button>
                        {post.awards > 0 && (
                          <div className="ml-auto flex items-center gap-1">
                            <span className="text-yellow-500">🏆</span>
                            <span className="font-medium">{post.awards}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="sticky top-6 w-80 space-y-4 self-start">
            {/* About Community */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                <h3 className="font-bold text-white">About Community</h3>
              </div>
              <div className="space-y-4 p-4">
                <p className="text-sm leading-relaxed text-gray-700">
                  {mockCommunity.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="size-4" />
                  <span>Created {mockCommunity.createdDate}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Globe className="size-4" />
                  <span>Public</span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatNumber(mockCommunity.totalMembers)}
                    </div>
                    <div className="text-xs text-gray-500">Members</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xl font-bold text-gray-900">
                      {formatNumber(mockCommunity.weeklyContributions)}
                      <TrendingUp className="size-4 text-green-500" />
                    </div>
                    <div className="text-xs text-gray-500">Weekly posts</div>
                  </div>
                </div>

                <button className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700">
                  Create Post
                </button>
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
                  {mockCommunity.moderators.map((mod, idx) => (
                    <div
                      key={idx}
                      className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-blue-50"
                    >
                      <img
                        src={mod.avatar}
                        alt={mod.name}
                        className="size-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {mod.name}
                      </span>
                    </div>
                  ))}
                  <button className="w-full rounded-lg py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50">
                    View all moderators
                  </button>
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
        </div>
      </div>
    </div>
  );
};

export default CommunityView;
