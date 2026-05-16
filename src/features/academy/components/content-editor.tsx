import Editor from '@monaco-editor/react';
import { Code2, FileText, Image, Plus, X } from 'lucide-react';
import { useState } from 'react';

import { MediaUploader } from '@/components/ui/media-uploader';
import { useNotifications } from '@/components/ui/notifications';
import { TextEditor } from '@/components/ui/text-editor';
import { ContentSection } from '@/types/api';

import { useCreateContent } from '../api/create-content';
import { useDeleteContent } from '../api/delete-content';
import { useUpdateContent } from '../api/update-content';

const MONACO_LANGUAGES = [
  'go',
  'python',
  'javascript',
  'typescript',
  'c',
  'cpp',
  'java',
  'ruby',
  'php',
  'csharp',
  'rust',
  'swift',
  'kotlin',
  'sql',
  'html',
  'css',
  'json',
  'yaml',
  'markdown',
  'shell',
];

type ContentEditorProps = {
  lessonSlug: string;
  existingContent?: {
    sections: ContentSection[];
  } | null;
  onSuccess: () => void;
};

type EditableSection = {
  type: 'text' | 'code' | 'media';
  content?: string;
  language?: string;
  url?: string;
};

export const ContentEditor = ({
  lessonSlug,
  existingContent,
  onSuccess,
}: ContentEditorProps) => {
  const isUpdate = !!existingContent;
  const { addNotification } = useNotifications();

  const [sections, setSections] = useState<EditableSection[]>(
    existingContent?.sections.map((s) => ({
      type: s.type,
      content: s.content,
      language: s.language,
      url: s.url,
    })) ?? [{ type: 'text', content: '' }],
  );

  const createContentMutation = useCreateContent({
    lessonSlug,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Content Created',
          message: 'Lesson content has been created.',
        });
        onSuccess();
      },
    },
  });

  const updateContentMutation = useUpdateContent({
    lessonSlug,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Content Updated',
          message: 'Lesson content has been updated.',
        });
        onSuccess();
      },
    },
  });

  const deleteContentMutation = useDeleteContent({
    lessonSlug,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Content Deleted',
          message: 'Lesson content has been deleted.',
        });
        onSuccess();
      },
    },
  });

  const addSection = (type: 'text' | 'code' | 'media') => {
    const newSection: EditableSection = { type };
    if (type === 'code') {
      newSection.content = '';
      newSection.language = 'javascript';
    } else if (type === 'media') {
      newSection.url = '';
    } else {
      newSection.content = '';
    }
    setSections([...sections, newSection]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (
    index: number,
    field: string,
    value: string | undefined,
  ) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const handleSubmit = () => {
    const payload = {
      sections: sections.map((s) => {
        if (s.type === 'text')
          return { type: 'text' as const, content: s.content || '' };
        if (s.type === 'code')
          return {
            type: 'code' as const,
            content: s.content || '',
            language: s.language || '',
          };
        return { type: 'media' as const, url: s.url || '' };
      }),
    };

    if (isUpdate) {
      updateContentMutation.mutate({ lessonSlug, data: payload });
    } else {
      createContentMutation.mutate({ lessonSlug, data: payload });
    }
  };

  const isPending =
    createContentMutation.isPending || updateContentMutation.isPending;

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-gray-50 p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                value={section.type}
                onChange={(e) => updateSection(index, 'type', e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="text">Text</option>
                <option value="code">Code</option>
                <option value="media">Media</option>
              </select>
              <span className="text-xs text-gray-400">
                Section {index + 1}
              </span>
            </div>
            {sections.length > 1 && (
              <button
                type="button"
                onClick={() => removeSection(index)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {section.type === 'text' && (
            <TextEditor
              value={section.content || ''}
              onChange={(val) => updateSection(index, 'content', val)}
            />
          )}

          {section.type === 'code' && (
            <div className="space-y-2">
              <select
                value={section.language || 'javascript'}
                onChange={(e) =>
                  updateSection(index, 'language', e.target.value)
                }
                className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {MONACO_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <div className="overflow-hidden rounded-lg border border-gray-300">
                <Editor
                  height="280px"
                  language={section.language || 'javascript'}
                  value={section.content || ''}
                  onChange={(val) => updateSection(index, 'content', val)}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    padding: { top: 12 },
                  }}
                />
              </div>
            </div>
          )}

          {section.type === 'media' && (
            <MediaUploader
              value={section.url ? [section.url] : []}
              onChange={(urls) => updateSection(index, 'url', urls[0] || '')}
              maxFiles={1}
              accept={{ images: true, videos: true }}
              mode="replace"
            />
          )}
        </div>
      ))}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => addSection('text')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
        >
          <FileText className="size-3.5" /> Text
        </button>
        <button
          type="button"
          onClick={() => addSection('code')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
        >
          <Code2 className="size-3.5" /> Code
        </button>
        <button
          type="button"
          onClick={() => addSection('media')}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
        >
          <Image className="size-3.5" /> Media
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <div>
          {isUpdate && (
            <button
              type="button"
              onClick={() => deleteContentMutation.mutate({ lessonSlug })}
              disabled={deleteContentMutation.isPending}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              {deleteContentMutation.isPending
                ? 'Deleting...'
                : 'Delete Content'}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
        >
          {isPending
            ? 'Saving...'
            : isUpdate
              ? 'Update Content'
              : 'Create Content'}
        </button>
      </div>
    </div>
  );
};
