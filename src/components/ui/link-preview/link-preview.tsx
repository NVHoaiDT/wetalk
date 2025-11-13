/* 
  title: string;
  description: string;
  images: string[];
  sitename: string;
  favicon: string;
  duration: number;
  domain: string;
  url: string;
  source: string;
*/

import { useLinkMetadata } from '@/lib/get-metadata';

import { Spinner } from '../spinner';

export type LinkPreviewProps = {
  link: string;
};

export const LinkPreview = ({ link }: LinkPreviewProps) => {
  const linkMetadataQuery = useLinkMetadata({ url: link });

  if (linkMetadataQuery.isLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (linkMetadataQuery.error || !linkMetadataQuery.data) {
    return (
      /* TODO: polish this UI */
      <div className="rounded border bg-gray-50 p-4 text-gray-500">
        Unable to load link preview.
      </div>
    );
  }

  const linkMetadata = linkMetadataQuery.data.data;

  /* TODO: polish this UI */
  return (
    <div className="max-w-md overflow-hidden rounded-lg border border-gray-200 shadow-sm">
      <p>{linkMetadata.description}</p>
      {/* <p>{linkMetadata.title}</p>
      <p>{linkMetadata.sitename}</p>
      <img src={linkMetadata.images[0]} alt={linkMetadata.title} />
      <img src={linkMetadata.favicon} alt={linkMetadata.sitename} /> */}
    </div>
  );
};
