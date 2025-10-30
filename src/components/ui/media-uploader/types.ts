export type MediaFile = {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
};

export type MediaUploaderProps = {
  /** Callback when media URLs are ready */
  onChange: (urls: string[]) => void;
  /** Callback for handling errors */
  onError?: (error: Error) => void;
  /** Maximum number of files allowed */
  maxFiles?: number;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Accepted file types */
  accept?: {
    images?: boolean;
    videos?: boolean;
  };
  /** Currently uploaded URLs */
  value?: string[];
  /** Additional className for the container */
  className?: string;
};
