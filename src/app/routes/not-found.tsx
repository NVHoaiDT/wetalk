import { HouseWifi, LayoutDashboard } from 'lucide-react';

import { Link } from '@/components/ui/link';
import { paths } from '@/config/paths';

const NotFoundRoute = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-12">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left Section - Text Information */}
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-6xl font-bold text-transparent md:text-7xl">
              404
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Opps you have found the lost world !
            </h2>
            <p className="text-lg text-gray-600">
              Sorry, the page you are looking for doesn&apos;t exist or has been
              moved. Let&apos;s get you back on track!
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={paths.home.getHref()}
              replace
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <HouseWifi className="size-5" />
              Go to Home
            </Link>

            <Link
              to={paths.app.dashboard.getHref()}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              <LayoutDashboard className="size-5" />
              Dashboard
            </Link>
          </div>
        </div>

        {/* Right Section - Decorative Image */}
        <div className="flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/djwpst00v/image/upload/v1763789403/13379593_5219088_iajsfa.svg"
            alt="404 illustration"
            className="w-full max-w-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFoundRoute;
