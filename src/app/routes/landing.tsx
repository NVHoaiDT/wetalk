import { MessageCircle, Users, TrendingUp, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Head } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';
import { useCurrentUser } from '@/lib/auth';

const LandingRoute = () => {
  const navigate = useNavigate();
  const user = useCurrentUser();

  const handleStart = () => {
    if (user.data) {
      navigate(paths.app.dashboard.getHref());
    } else {
      navigate(paths.auth.login.getHref());
    }
  };

  return (
    <>
      <Head description="Connect, share, and engage with communities on WeTalk" />
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/30 to-white">
        {/* Dotted Background Pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Hero Section */}
        <div className="relative">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              {/* Left Content */}
              <div className="space-y-8">
                {/* Greeting Badge */}
                <div className="inline-block">
                  <div className="relative inline-block">
                    <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 opacity-30 blur" />
                    <span className="relative inline-block rounded-lg bg-white px-4 py-2 text-2xl font-bold text-gray-800">
                      Hey.
                    </span>
                  </div>
                </div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                    <span className="block">Connect with</span>
                    <span className="relative mt-2 block">
                      <span className="relative z-10">Communities</span>
                      <svg
                        className="absolute -bottom-2 left-0 w-full text-cyan-400"
                        height="12"
                        viewBox="0 0 300 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 10C50 5 100 2 150 3C200 4 250 7 298 10"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600">
                    Join communities, share ideas, and engage in meaningful
                    conversations. Your voice matters in the world of WeTalk.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    onClick={handleStart}
                    size="lg"
                    className="group bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-6 text-lg font-semibold shadow-lg transition-all hover:shadow-xl hover:shadow-cyan-500/50"
                  >
                    <div className="flex items-center">
                      <Sparkles className="mr-2 size-5 transition-transform group-hover:rotate-12" />
                      Get Started
                    </div>
                  </Button>
                  <a
                    href="https://github.com/NVHoaiDT/we-talk"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-2 border-gray-200 px-8 py-6 text-lg font-semibold transition-all hover:border-cyan-500 hover:bg-cyan-50 sm:w-auto"
                    >
                      <div className="flex items-center">
                        <svg
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="mr-2 size-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        View on GitHub
                      </div>
                    </Button>
                  </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-600">10K+</div>
                    <div className="text-sm text-gray-600">Communities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-600">50K+</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-600">1M+</div>
                    <div className="text-sm text-gray-600">Discussions</div>
                  </div>
                </div>
              </div>

              {/* Right Illustration */}
              <div className="relative lg:pl-8">
                <div className="relative">
                  {/* Decorative Elements */}
                  <div className="absolute -left-4 -top-4 size-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-20 blur-2xl" />
                  <div className="absolute -bottom-8 -right-4 size-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 opacity-20 blur-2xl" />

                  {/* Main Illustration Container */}
                  <div className="relative rounded-3xl bg-white p-8 shadow-2xl">
                    {/* Browser-like Header */}
                    <div className="mb-6 flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
                      <div className="flex gap-1.5">
                        <div className="size-3 rounded-full bg-white/30" />
                        <div className="size-3 rounded-full bg-white/50" />
                        <div className="size-3 rounded-full bg-white/70" />
                      </div>
                      <div className="ml-4 h-2 flex-1 rounded bg-white/20" />
                    </div>

                    {/* Content Cards */}
                    <div className="space-y-4">
                      {/* Community Card */}
                      <div className="group flex items-center gap-4 rounded-xl border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 p-4 transition-all hover:shadow-lg">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg">
                          <Users className="size-6" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="h-3 w-24 rounded bg-gray-300" />
                          <div className="h-2 w-16 rounded bg-gray-200" />
                        </div>
                        <div className="size-6 rounded bg-cyan-500 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>

                      {/* Discussion Card */}
                      <div className="group flex items-center gap-4 rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4 transition-all hover:shadow-lg">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 text-white shadow-lg">
                          <MessageCircle className="size-6" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="h-3 w-32 rounded bg-gray-300" />
                          <div className="h-2 w-20 rounded bg-gray-200" />
                        </div>
                        <div className="size-6 rounded bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>

                      {/* Trending Card */}
                      <div className="group flex items-center gap-4 rounded-xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 transition-all hover:shadow-lg">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg">
                          <TrendingUp className="size-6" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="h-3 w-28 rounded bg-gray-300" />
                          <div className="h-2 w-24 rounded bg-gray-200" />
                        </div>
                        <div className="size-6 rounded bg-amber-500 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute -right-4 -top-4 rotate-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-bold text-white shadow-xl">
                      <Sparkles className="mr-1 inline size-4" />
                      Live Now
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Why Choose WeTalk?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Everything you need to build meaningful connections
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-cyan-500 hover:shadow-xl">
                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 p-3 text-white">
                  <Users className="size-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  Join Communities
                </h3>
                <p className="text-gray-600">
                  Discover and join communities that match your interests and
                  passions.
                </p>
              </div>

              <div className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-purple-500 hover:shadow-xl">
                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 p-3 text-white">
                  <MessageCircle className="size-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  Share Ideas
                </h3>
                <p className="text-gray-600">
                  Create posts, share your thoughts, and engage in rich
                  discussions.
                </p>
              </div>

              <div className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-amber-500 hover:shadow-xl">
                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 p-3 text-white">
                  <TrendingUp className="size-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  Stay Updated
                </h3>
                <p className="text-gray-600">
                  Follow trending topics and never miss important conversations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingRoute;
