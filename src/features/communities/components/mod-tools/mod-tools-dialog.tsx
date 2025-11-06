import { Shield } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
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

type ModSection = 'members' | 'posts';

type ModToolsDialogProps = {
  communityId: number;
};

export const ModToolsDialog = ({ communityId }: ModToolsDialogProps) => {
  const { isOpen, open, close } = useDisclosure();
  const [activeSection, setActiveSection] = useState<ModSection>('members');

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'members':
        return 'Manage Members';
      case 'posts':
        return 'Manage Posts';
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
        <Button
          onClick={open}
          size="sm"
          variant="outline"
          icon={<Shield className="size-4" />}
          className="border-gray-300 bg-white font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
        >
          Mod Tools
        </Button>
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
              <MembersSection communityId={communityId} />
            )}
            {activeSection === 'posts' && (
              <PostsSection communityId={communityId} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
