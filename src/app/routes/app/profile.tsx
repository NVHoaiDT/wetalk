import { Mail, User, Shield, FileText, Camera } from 'lucide-react';

import { MainErrorFallback } from '@/components/errors/main';
import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import { UpdateProfile } from '@/features/users/components/update-profile';
import { useCurrentUser } from '@/lib/auth';

type EntryProps = {
  label: string;
  value?: string;
  icon: React.ReactNode;
};

const Entry = ({ label, value, icon }: EntryProps) => (
  <div className="group relative rounded-xl p-6 transition-all duration-300 hover:bg-blue-50/50">
    <div className="flex items-start space-x-4">
      <div className="mt-1 shrink-0">
        <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <dt className="mb-1 text-sm font-semibold text-gray-600">{label}</dt>
        <dd className="break-words text-base text-gray-900">
          {value || 'Not provided'}
        </dd>
      </div>
    </div>
  </div>
);

const ProfileRoute = () => {
  const { data, status } = useCurrentUser();

  if (status === 'pending') {
    return <Spinner />;
  }

  if (status === 'error') {
    return <MainErrorFallback />;
  }

  const user = data?.data;
  if (!user) {
    return null;
  }
  const wellcome = `Hi, ${user.username}!`;

  return (
    <ContentLayout title={wellcome}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header Card with Avatar */}
          <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute left-0 top-0 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"></div>
              <div className="absolute bottom-0 right-0 size-96 translate-x-1/2 translate-y-1/2 rounded-full bg-white"></div>
            </div>

            <div className="relative px-8 py-12">
              <div className="flex flex-col items-center space-y-6 sm:flex-row sm:items-start sm:space-x-8 sm:space-y-0">
                {/* Avatar */}
                <div className="group relative">
                  <div className="flex size-32 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-300 to-blue-400 text-4xl font-bold text-white shadow-2xl transition-transform duration-300 group-hover:scale-105">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 flex size-10 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl">
                    <Camera className="size-5 text-blue-600" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="mb-2 text-4xl font-bold text-white">
                    {user.username}
                  </h1>
                  <p className="mb-4 flex items-center justify-center space-x-2 text-lg text-blue-100 sm:justify-start">
                    <Mail className="size-5" />
                    <span>{user.email}</span>
                  </p>
                  <div className="inline-flex items-center space-x-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 backdrop-blur-sm">
                    <Shield className="size-4 text-white" />
                    <span className="font-medium text-white">{user.role}</span>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="sm:self-start">
                  <UpdateProfile />
                </div>
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid gap-6">
            {/* Personal Information Card */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl transition-shadow duration-300 hover:shadow-2xl">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
                <h2 className="flex items-center space-x-3 text-2xl font-bold text-white">
                  <User className="size-6" />
                  <span>Personal Information</span>
                </h2>
                <p className="mt-2 text-blue-100">
                  Your account details and preferences
                </p>
              </div>

              <div className="p-4">
                <div className="grid gap-2">
                  <Entry
                    label="Username"
                    value={user.username}
                    icon={<User className="size-5" />}
                  />
                  <Entry
                    label="Email Address"
                    value={user.email}
                    icon={<Mail className="size-5" />}
                  />
                  <Entry
                    label="Role"
                    value={user.role}
                    icon={<Shield className="size-5" />}
                  />
                </div>
              </div>
            </div>

            {/* Bio Card */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl transition-shadow duration-300 hover:shadow-2xl">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
                <h2 className="flex items-center space-x-3 text-2xl font-bold text-white">
                  <FileText className="size-6" />
                  <span>About Me</span>
                </h2>
                <p className="mt-2 text-blue-100">Tell others about yourself</p>
              </div>

              <div className="p-8">
                <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
                  <p className="text-base leading-relaxed text-gray-700">
                    {user.bio ||
                      'No bio provided yet. Click "Edit Profile" to add one.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="mb-2 text-4xl font-bold">142</div>
                <div className="text-blue-100">Connections</div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="mb-2 text-4xl font-bold">28</div>
                <div className="text-blue-100">Posts</div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-blue-800 p-6 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="mb-2 text-4xl font-bold">1.2K</div>
                <div className="text-blue-100">Likes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default ProfileRoute;
