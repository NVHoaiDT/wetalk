import {
  Home,
  PanelLeft,
  Users,
  User2,
  MessageCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Hash,
  TrendingUp,
  Bell,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useNavigation } from 'react-router';

import logo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { paths } from '@/config/paths';
/* Still find the way to handle these stuffs */
import { useRecentCommunities } from '@/features/communities/api/get-recent-community';
import { useMessages } from '@/features/messages/stores/messages-store';
import { useNotifications } from '@/features/notifications/stores/notifications-store';
import { useRecentPosts } from '@/features/posts/api/get-recent-posts';
import { Search } from '@/features/search/components/search';
import { useLogout } from '@/lib/auth';
import { ROLES, useAuthorization } from '@/lib/authorization';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/format';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown';
import { Link } from '../ui/link';

type SideNavigationItem = {
  name: string;
  to: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

const Logo = () => {
  return (
    <Link className="flex items-center text-white" to={paths.home.getHref()}>
      <img className="h-8 w-auto" src={logo} alt="Workflow" />
      <span className="text-sm font-semibold text-white">Wetalk</span>
    </Link>
  );
};

const Progress = () => {
  const { state, location } = useNavigation();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
  }, [location?.pathname]);

  useEffect(() => {
    if (state === 'loading') {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer);
            return 100;
          }
          const newProgress = oldProgress + 10;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 300);

      return () => {
        clearInterval(timer);
      };
    }
  }, [state]);

  if (state !== 'loading') {
    return null;
  }

  return (
    <div
      className="fixed left-0 top-0 h-1 bg-blue-500 transition-all duration-200 ease-in-out"
      style={{ width: `${progress}%` }}
    ></div>
  );
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const logout = useLogout();
  /* const { checkAccess } = useAuthorization(); */
  const { openMessages, unreadCount: messagesUnreadCount } = useMessages();
  const { unreadCount: notificationsUnreadCount } = useNotifications();

  // State for dropdown sections
  const [isRecentOpen, setIsRecentOpen] = useState(true);
  const [isRecentCommunitiesOpen, setIsRecentCommunitiesOpen] = useState(true);

  const recentCommunitiesQuery = useRecentCommunities();
  const recentCommunities = recentCommunitiesQuery.data || [];

  const recentPostsQuery = useRecentPosts();
  const recentPosts = recentPostsQuery.data || [];

  const navigation = [
    { name: 'Dashboard', to: paths.app.dashboard.getHref(), icon: Home },
    { name: 'Communities', to: paths.app.communities.getHref(), icon: Users },
    /* checkAccess({ allowedRoles: [ROLES.admin] }) && {
      name: 'Users',
      to: paths.app.users.getHref(),
      icon: User2,
    }, */
  ].filter(Boolean) as SideNavigationItem[];

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r sm:flex">
        <nav className="flex flex-col items-center gap-1 overflow-y-scroll px-2 py-4">
          <div className="flex h-16 shrink-0 items-center px-4">
            <Logo />
          </div>
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.name !== 'Discussions'}
              className={({ isActive }) =>
                cn(
                  'text-gray-700 hover:bg-gray-200',
                  'group flex flex-1 w-full items-center rounded-xl px-2 py-2 text-base font-medium',
                  isActive && 'bg-slate-100 border border-slate-300',
                )
              }
            >
              <item.icon
                className={cn(
                  'text-gray-500 group-hover:text-gray-600',
                  'mr-4 size-6 shrink-0',
                )}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}

          {/* RECENT POSTS SECTION */}
          <div className="mt-4 w-full">
            <button
              onClick={() => setIsRecentOpen(!isRecentOpen)}
              className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold tracking-wider text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
            >
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <span>POSTS</span>
              </div>
              {isRecentOpen ? (
                <ChevronUp className="size-4 transition-transform" />
              ) : (
                <ChevronDown className="size-4 transition-transform" />
              )}
            </button>

            {isRecentOpen && (
              <div className="mt-2 space-y-1 overflow-hidden">
                {recentPosts.map((post) => (
                  <NavLink to={paths.app.post.getHref(post.id)} key={post.id}>
                    <button className="group flex w-full flex-col gap-1 rounded-lg px-3 py-2 text-left transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50">
                      <div className="flex items-start gap-2">
                        <Hash className="mt-0.5 size-3 shrink-0 text-gray-400 group-hover:text-blue-500" />
                        <div className="flex-1 overflow-hidden">
                          <p className="truncate text-sm font-medium text-gray-700 group-hover:text-blue-700">
                            {post.title}
                          </p>
                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                            <span className="text-blue-600">
                              r/{post.community.name}
                            </span>
                            {/* <span>•</span>
                          <span>
                            {' '}
                            {formatDistanceToNow(new Date(post.createdAt), {
                              addSuffix: true,
                            })}
                          </span> */}
                          </div>
                        </div>
                      </div>
                    </button>
                  </NavLink>
                ))}
                {recentPosts.length === 0 && (
                  <div className="px-3 py-4 text-center text-xs text-gray-500">
                    No recent posts
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RECENT COMMUNITIES SECTION */}
          <div className="w-full">
            <button
              onClick={() =>
                setIsRecentCommunitiesOpen(!isRecentCommunitiesOpen)
              }
              className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold tracking-wider text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4" />
                <span>COMMUNITIES</span>
              </div>
              {isRecentCommunitiesOpen ? (
                <ChevronUp className="size-4 transition-transform" />
              ) : (
                <ChevronDown className="size-4 transition-transform" />
              )}
            </button>

            {isRecentCommunitiesOpen && (
              <div className="overflow-hidden">
                {recentCommunities.map((community) => (
                  <NavLink
                    to={paths.app.community.getHref(community.id)}
                    key={community.id}
                    className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-sm">
                      <img
                        src={
                          community.communityAvatar ||
                          'https://b.thumbs.redditmedia.com/J_fCwTYJkoM-way-eaOHv8AOHoF_jNXNqOvPrQ7bINY.png'
                        }
                        alt={community.name}
                        className="size-full rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden text-left">
                      <p className="truncate text-sm font-semibold text-gray-700 group-hover:text-purple-700">
                        r/{community.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {community.totalMembers} members
                      </p>
                    </div>
                  </NavLink>
                ))}
                {recentCommunities.length === 0 && (
                  <div className="px-3 py-4 text-center text-xs text-gray-500">
                    Explore communities to see them here
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Progress />

          <Drawer>
            <DrawerTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="size-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent
              side="left"
              className="bg-black pt-10 text-white sm:max-w-60"
            >
              <nav className="grid gap-6 text-lg font-medium">
                <div className="flex h-16 shrink-0 items-center px-4">
                  <Logo />
                </div>
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    end
                    className={({ isActive }) =>
                      cn(
                        'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'group flex flex-1 w-full items-center rounded-md p-2 text-base font-medium',
                        isActive && 'bg-gray-900 text-white',
                      )
                    }
                  >
                    <item.icon
                      className={cn(
                        'text-gray-400 group-hover:text-gray-300',
                        'mr-4 size-6 shrink-0',
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}

                {/* RECENT POSTS SECTION - MOBILE */}
                <div className="mt-4 w-full px-2">
                  <button
                    onClick={() => setIsRecentOpen(!isRecentOpen)}
                    className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 transition-all duration-200 hover:bg-gray-800 hover:text-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="size-4" />
                      <span>Recent</span>
                    </div>
                    {isRecentOpen ? (
                      <ChevronUp className="size-4 transition-transform" />
                    ) : (
                      <ChevronDown className="size-4 transition-transform" />
                    )}
                  </button>

                  {isRecentOpen && (
                    <div className="mt-2 space-y-1 overflow-hidden">
                      {recentPosts.map((post) => (
                        <button
                          key={post.id}
                          className="group flex w-full flex-col gap-1 rounded-lg px-3 py-2 text-left transition-all duration-200 hover:bg-gray-800"
                        >
                          <div className="flex items-start gap-2">
                            <Hash className="mt-0.5 size-3 shrink-0 text-gray-500 group-hover:text-blue-400" />
                            <div className="flex-1 overflow-hidden">
                              <p className="truncate text-xs font-medium text-gray-300 group-hover:text-blue-300">
                                {post.title}
                              </p>
                              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                                <span className="text-blue-400">
                                  r/{post.community.name}
                                </span>
                                <span>•</span>
                                <span>{formatDate(post.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* MY COMMUNITIES SECTION - MOBILE */}
                <div className="mt-2 w-full px-2">
                  <button
                    onClick={() =>
                      setIsRecentCommunitiesOpen(!isRecentCommunitiesOpen)
                    }
                    className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 transition-all duration-200 hover:bg-gray-800 hover:text-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="size-4" />
                      <span>My Communities</span>
                    </div>
                    {isRecentCommunitiesOpen ? (
                      <ChevronUp className="size-4 transition-transform" />
                    ) : (
                      <ChevronDown className="size-4 transition-transform" />
                    )}
                  </button>

                  {isRecentCommunitiesOpen && (
                    <div className="mt-2 space-y-1 overflow-hidden">
                      {recentCommunities.map((community) => (
                        <button
                          key={community.id}
                          className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-gray-800"
                        >
                          <div className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full">
                            <img
                              src={community.communityAvatar}
                              alt={community.name}
                              className="size-full rounded-full object-cover"
                            />
                          </div>

                          <div className="flex-1 overflow-hidden text-left">
                            <p className="truncate text-xs font-semibold text-gray-300 group-hover:text-purple-300">
                              r/{community.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {community.totalMembers} members
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </nav>
            </DrawerContent>
          </Drawer>
          <div className="flex flex-1 justify-center px-4 sm:px-6">
            <Search />
          </div>

          {/* Notifications Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(paths.app.notifications.getHref())}
            className="relative border-yellow-200 bg-yellow-50 text-yellow-500 hover:bg-yellow-100 hover:text-yellow-700"
          >
            <Bell className="size-5" />
            {notificationsUnreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                {notificationsUnreadCount > 9 ? '9+' : notificationsUnreadCount}
              </span>
            )}
          </Button>

          {/* Messages Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={openMessages}
            className="relative border-sky-200 bg-sky-50 text-sky-500 hover:bg-sky-100 hover:text-sky-700"
          >
            <MessageCircle className="size-5" />
            {messagesUnreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                {messagesUnreadCount > 9 ? '9+' : messagesUnreadCount}
              </span>
            )}
          </Button>
          {/* Profile button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800"
              >
                <span className="sr-only">Open user menu</span>
                <User2 className="size-6 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate(paths.app.profile.getHref())}
                className={cn('block px-4 py-2 text-sm text-gray-700')}
              >
                Your Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(paths.app.settings.getHref())}
                className={cn('block px-4 py-2 text-sm text-gray-700')}
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={cn('block px-4 py-2 text-sm text-gray-700 w-full')}
                onClick={() => logout.mutate()}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
