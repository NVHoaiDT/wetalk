import { ChevronRight, Globe, Layers, Play } from 'lucide-react';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/form/switch';
import { Spinner } from '@/components/ui/spinner';
import {
  Preferences,
  usePreferences,
} from '@/features/settings/api/get-preferences';
import { useUpdatePreferences } from '@/features/settings/api/update-preferences';

const LANGUAGES = [
  { code: 'en-US', name: 'English (US)', nativeName: 'English' },
  { code: 'vi-VN', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko-KR', name: 'Korean', nativeName: '한국어' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch' },
];

export const SettingPreferences = () => {
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const preferencesQueryClient = usePreferences();
  const updatePreferencesMutation = useUpdatePreferences();

  const handleToggle = (key: keyof Preferences, value: boolean) => {
    updatePreferencesMutation.mutate({ data: { [key]: value } });
  };

  const handleLanguageChange = (languageCode: string) => {
    updatePreferencesMutation.mutate(
      { data: { language: languageCode } },
      {
        onSuccess: () => {
          setIsLanguageDialogOpen(false);
        },
      },
    );
  };

  if (preferencesQueryClient.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const preferences = preferencesQueryClient.data;

  const selectedLanguage = LANGUAGES.find(
    (lang) => lang.code === preferences?.language,
  );

  return (
    <div className="space-y-8">
      {/* Language Section */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Globe className="size-5 text-blue-600" />
          Language
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => setIsLanguageDialogOpen(true)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-md"
          >
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-700">
                Display language
              </p>
              <p className="text-xs text-gray-500">
                {selectedLanguage?.nativeName || 'English (US)'}
              </p>
            </div>
            <ChevronRight className="size-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Layers className="size-5 text-purple-600" />
          Content
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700">
                Show recent posts in sidebar
              </p>
              <p className="text-xs text-gray-500">
                Display your recently viewed posts
              </p>
            </div>
            <Switch
              checked={preferences?.showRecentPosts ?? true}
              onCheckedChange={(checked) =>
                handleToggle('showRecentPosts', checked)
              }
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700">
                Show recent communities
              </p>
              <p className="text-xs text-gray-500">
                Display your recently visited communities
              </p>
            </div>
            <Switch
              checked={preferences?.showRecentCommunities ?? true}
              onCheckedChange={(checked) =>
                handleToggle('showRecentCommunities', checked)
              }
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Accessibility Section */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Play className="size-5 text-green-600" />
          Accessibility
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700">
                Autoplay media
              </p>
              <p className="text-xs text-gray-500">
                Automatically play videos and GIFs
              </p>
            </div>
            <Switch
              checked={preferences?.autoplayMedia ?? false}
              onCheckedChange={(checked) =>
                handleToggle('autoplayMedia', checked)
              }
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-700">
                Reduce motion
              </p>
              <p className="text-xs text-gray-500">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              checked={preferences?.reduceMotion ?? false}
              onCheckedChange={(checked) =>
                handleToggle('reduceMotion', checked)
              }
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Language Selection Dialog */}
      <Dialog
        open={isLanguageDialogOpen}
        onOpenChange={setIsLanguageDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="size-5 text-blue-600" />
              Select Language
            </DialogTitle>
            <DialogDescription>
              Choose your preferred display language
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all ${
                  preferences?.language === lang.code
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {lang.nativeName}
                  </p>
                  <p className="text-xs text-gray-500">{lang.name}</p>
                </div>
                {preferences?.language === lang.code && (
                  <div className="size-2 rounded-full bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
