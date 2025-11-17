import { Bell, Mail, Settings as SettingsIcon, User } from 'lucide-react';
import { useState } from 'react';

import { ContentLayout } from '@/components/layouts';
import {
  SettingAccounts,
  SettingNotification,
  SettingPreferences,
} from '@/features/settings/components';

type SettingTab = 'account' | 'preferences' | 'notifications' | 'email';

const TABS: { id: SettingTab; label: string; icon: any; color: string }[] = [
  { id: 'account', label: 'Account', icon: User, color: 'text-blue-600' },
  {
    id: 'preferences',
    label: 'Preferences',
    icon: SettingsIcon,
    color: 'text-purple-600',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    color: 'text-orange-600',
  },
  { id: 'email', label: 'Email', icon: Mail, color: 'text-green-600' },
];

const SettingRoute = () => {
  const [activeTab, setActiveTab] = useState<SettingTab>('preferences');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <SettingAccounts />;
      case 'preferences':
        return <SettingPreferences />;
      case 'notifications':
        return <SettingNotification />;
      case 'email':
        return (
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <Mail className="mx-auto mb-4 size-16 text-gray-300" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Email Settings
                </h3>
                <p className="text-sm text-gray-500">
                  Email preferences coming soon
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ContentLayout>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="sticky top-6 space-y-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${
                      isActive
                        ? 'border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Icon
                      className={`size-5 ${isActive ? tab.color : 'text-gray-400'}`}
                    />
                    <span
                      className={`text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}
                    >
                      {tab.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto size-2 rounded-full bg-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">{renderTabContent()}</div>
        </div>
      </div>
    </ContentLayout>
  );
};

export default SettingRoute;
