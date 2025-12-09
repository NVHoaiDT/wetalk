import { Shield } from 'lucide-react';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDisclosure } from '@/hooks/use-disclosure';

import { MembersSection } from './members-section';
import { ModSidebar } from './mod-sidebar';
import { PostsSection } from './posts-section';
import { ReportedCommentsSection } from './reported-comments-section';
import { ReportedPostsSection } from './reported-posts-section';

export type ModSection =
  | 'members'
  | 'posts'
  | 'reported-posts'
  | 'reported-comments';

type ModToolsDialogProps = {
  communityId: number;
  role: 'super_admin' | 'admin' | 'user';
};

export const ModToolsDialog = ({ communityId, role }: ModToolsDialogProps) => {
  const { isOpen, open, close } = useDisclosure();
  const [activeSection, setActiveSection] = useState<ModSection>('members');

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'members':
        return 'Manage Members';
      case 'posts':
        return 'Manage Posts';
      case 'reported-posts':
        return 'Manage Reported Posts';
      case 'reported-comments':
        return 'Manage Reported Comments';
      default:
        return 'Mod Tools';
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isDialogOpen) => {
        if (isDialogOpen) {
          setActiveSection('members');
          open();
        } else {
          close();
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          onClick={open}
          className="flex w-full flex-row justify-start gap-2 border-b border-gray-200 px-2 py-1.5 text-sm font-normal"
        >
          <Shield className="size-5 text-gray-600" />
          Mod Tools
        </button>
      </DialogTrigger>

      <DialogContent className="h-[90vh] max-w-6xl overflow-hidden p-0">
        {/* Header Section */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-white">
              {getSectionTitle()}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <ModSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {activeSection === 'members' && (
              <MembersSection communityId={communityId} role={role} />
            )}
            {activeSection === 'posts' && (
              <PostsSection communityId={communityId} />
            )}
            {activeSection === 'reported-posts' && (
              <ReportedPostsSection communityId={communityId} />
            )}
            {activeSection === 'reported-comments' && (
              <ReportedCommentsSection communityId={communityId} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
