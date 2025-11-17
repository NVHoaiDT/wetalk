import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Globe, Lock, Mail, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/form/input';
import { useNotifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import {
  changePasswordInput,
  ChangePasswordInput,
  useChangePassword,
  useCurrentUser,
} from '@/lib/auth';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CN', name: 'China' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'DE', name: 'Germany' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IT', name: 'Italy' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'IN', name: 'India' },
  { code: 'RU', name: 'Russia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'PH', name: 'Philippines' },
];

type DialogType =
  | 'password'
  | 'phone'
  | 'gender'
  | 'location'
  | 'delete'
  | null;

export const SettingAccounts = () => {
  const { addNotification } = useNotifications();

  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedCountry, setSelectedCountry] = useState('US');

  const userQuery = useCurrentUser();
  const changePasswordMutation = useChangePassword({
    onSuccess: () => {
      setActiveDialog(null);
      form.reset();
      addNotification({
        type: 'success',
        title: 'Your Password Changed',
      });
    },
  });

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordInput),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
  });

  const handlePasswordSubmit = (data: ChangePasswordInput) => {
    changePasswordMutation.mutate(data);
  };

  const handleLocationChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    // TODO: Implement location update API call
    setActiveDialog(null);
  };

  if (userQuery.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const user = userQuery.data?.data;

  return (
    <div className="space-y-8">
      {/* General Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">General</h3>
        <div className="space-y-3">
          {/* Password */}
          <button
            onClick={() => setActiveDialog('password')}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <Lock className="size-5 text-purple-600" />
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-700">Password</p>
                <p className="text-xs text-gray-500">********</p>
              </div>
            </div>
            <ChevronRight className="size-5 text-gray-400" />
          </button>

          {/* Gender */}
          <button
            onClick={() => setActiveDialog('gender')}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <User className="size-5 text-orange-600" />
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-700">Gender</p>
                <p className="text-xs text-gray-500">Man</p>
              </div>
            </div>
            <ChevronRight className="size-5 text-gray-400" />
          </button>

          {/* Location */}
          <button
            onClick={() => setActiveDialog('location')}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <Globe className="size-5 text-blue-600" />
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-700">
                  Location customization
                </p>
                <p className="text-xs text-gray-500">
                  Use approximate location (based on IP)
                </p>
              </div>
            </div>
            <ChevronRight className="size-5 text-gray-400" />
          </button>
        </div>
      </div>
      {/* Email */}
      <button
        onClick={() => setActiveDialog('phone')}
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <Mail className="size-5 text-blue-600" />
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-700">Email address</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <ChevronRight className="size-5 text-gray-400" />
      </button>

      {/* Phone Number */}
      <button
        onClick={() => setActiveDialog('phone')}
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <User className="size-5 text-green-600" />
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-700">Phone Number</p>
            <p className="text-xs text-gray-500">Not set</p>
          </div>
        </div>
        <ChevronRight className="size-5 text-gray-400" />
      </button>
      {/* Delete Account Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Delete Account</h3>
        <button
          onClick={() => setActiveDialog('delete')}
          className="flex w-full items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm transition-all hover:border-red-300 hover:bg-red-100 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <Trash2 className="size-5 text-red-600" />
            <div className="text-left">
              <p className="text-sm font-semibold text-red-700">
                Delete account
              </p>
              <p className="text-xs text-red-600">
                Permanently delete your account and all data
              </p>
            </div>
          </div>
          <ChevronRight className="size-5 text-red-400" />
        </button>
      </div>

      {/* Change Password Dialog */}
      <Dialog
        open={activeDialog === 'password'}
        onOpenChange={(open) => {
          if (!open) {
            setActiveDialog(null);
            form.reset();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="size-5 text-purple-600" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={form.handleSubmit(handlePasswordSubmit)}
            className="space-y-4"
          >
            <Input
              type="password"
              label="Current Password"
              placeholder="Enter current password"
              registration={form.register('oldPassword')}
              error={form.formState.errors.oldPassword}
            />
            <Input
              type="password"
              label="New Password"
              placeholder="Enter new password (min 5 characters)"
              registration={form.register('newPassword')}
              error={form.formState.errors.newPassword}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setActiveDialog(null);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={changePasswordMutation.isPending}
              >
                Change Password
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Location Dialog */}
      <Dialog
        open={activeDialog === 'location'}
        onOpenChange={(open) => !open && setActiveDialog(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="size-5 text-blue-600" />
              Select Location
            </DialogTitle>
            <DialogDescription>
              Choose your preferred location
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                onClick={() => handleLocationChange(country.code)}
                className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all ${
                  selectedCountry === country.code
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {country.name}
                  </p>
                  <p className="text-xs text-gray-500">{country.code}</p>
                </div>
                {selectedCountry === country.code && (
                  <div className="size-2 rounded-full bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Coming Soon Dialogs */}
      <Dialog
        open={
          activeDialog === 'phone' ||
          activeDialog === 'gender' ||
          activeDialog === 'delete'
        }
        onOpenChange={(open) => !open && setActiveDialog(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {activeDialog === 'phone' && 'Phone Number'}
              {activeDialog === 'gender' && 'Gender'}
              {activeDialog === 'delete' && 'Delete Account'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex h-32 items-center justify-center">
            <div className="text-center">
              <p className="mb-2 text-sm font-semibold text-gray-900">
                Coming Soon
              </p>
              <p className="text-xs text-gray-500">
                This feature is currently under development
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setActiveDialog(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
