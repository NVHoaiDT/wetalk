import { MDPreview } from '@/components/ui/md-preview';
import { MediaViewer } from '@/components/ui/media-viewer';
import { ContentSection } from '@/types/api';

type ContentRendererProps = {
  sections: ContentSection[];
};

export const ContentRenderer = ({ sections }: ContentRendererProps) => {
  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div key={section.id ?? index}>
          {section.type === 'text' && section.content && (
            <div className="prose max-w-none">
              <MDPreview value={section.content} />
            </div>
          )}

          {section.type === 'code' && section.content && (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
                <span className="text-xs font-medium text-gray-400">
                  {section.language || 'code'}
                </span>
              </div>
              <pre className="overflow-x-auto bg-gray-900 p-4">
                <code className="text-sm text-gray-100">{section.content}</code>
              </pre>
            </div>
          )}

          {section.type === 'media' && section.url && (
            <MediaViewer
              mediaUrls={[section.url]}
              title={`Section ${index + 1}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
