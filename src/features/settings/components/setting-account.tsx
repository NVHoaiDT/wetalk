import { useState } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { useCurrentUser } from '@/lib/auth';

export const SettingAccounts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const userQuery = useCurrentUser();

  if (userQuery.isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const user = userQuery.data?.data;

  return (
    <div>
      <h3 className="text-lg font-medium">Email</h3>
      <p className="text-gray-600">{user?.email}</p>
      <h3 className="text-lg font-medium">Password</h3>
      <p className="text-gray-600">********</p>
    </div>
  );
};
