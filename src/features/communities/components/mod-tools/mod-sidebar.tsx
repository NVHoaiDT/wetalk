import { Users, FileText, Flag } from 'lucide-react';

type ModSection = 'members' | 'posts' | 'reported-posts';

type ModSidebarProps = {
  activeSection: ModSection;
  onSectionChange: (section: ModSection) => void;
};

export const ModSidebar = ({
  activeSection,
  onSectionChange,
}: ModSidebarProps) => {
  const sections = [
    { id: 'members' as ModSection, label: 'Members', icon: Users },
    { id: 'posts' as ModSection, label: 'Posts', icon: FileText },
    { id: 'reported-posts' as ModSection, label: 'Reported Posts', icon: Flag },
  ];

  return (
    <div className="flex w-48 flex-col gap-2 border-r border-gray-200 bg-gray-50 p-4">
      <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Sections
      </h3>
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;

        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`
              flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200
              ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <Icon
              className={`size-5 ${isActive ? 'text-white' : 'text-gray-500'}`}
            />
            <span className="font-medium">{section.label}</span>
          </button>
        );
      })}
    </div>
  );
};
