import { X, Image as ImageIcon, Video, Loader2 } from 'lucide-react';

import type { MediaFile } from './types';

type MediaPreviewProps = {
  file: MediaFile;
  onRemove: () => void;
};

export const MediaPreview = ({ file, onRemove }: MediaPreviewProps) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
      {file.type === 'image' ? (
        <>
          <ImageIcon className="absolute left-2 top-2 z-10 size-4 text-white" />
          <img
            src={file.preview}
            alt={file.file.name}
            className="h-24 w-full object-cover"
          />
        </>
      ) : (
        <>
          <Video className="absolute left-2 top-2 z-10 size-4 text-white" />
          <video className="h-24 w-full object-cover">
            <source src={file.preview} />
            <track kind="captions" />
            Your browser does not support the video tag.
          </video>
        </>
      )}

      {/* Loading Overlay */}
      {file.status === 'uploading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="size-6 animate-spin text-white" />
        </div>
      )}

      {/* Error Overlay */}
      {file.status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/50">
          <span className="text-sm text-white">{file.error || 'Error'}</span>
        </div>
      )}

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-red-500 opacity-0 shadow-lg transition-opacity hover:bg-red-600 group-hover:opacity-100"
      >
        <X className="size-4 text-white" />
      </button>
    </div>
  );
};
