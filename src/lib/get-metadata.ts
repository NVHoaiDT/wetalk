/* 
    {
    "title": "Motion — JavaScript & React animation library",
    "description": "Motion (prev Framer Motion) is a fast, production-grade web animation library for React, JavaScript and Vue. Build smooth UI animations with examples, tutorials, and a tiny footprint.",
    "images": [
        "https://framerusercontent.com/images/9IOwyTKAykVZTetDEOb7qh81ZQ.png"
    ],
    "sitename": "Motion",
    "favicon": "https://framerusercontent.com/images/3aQX5dnH5Yqgsn98QXKF2ZXxIE.png",
    "duration": 480,
    "domain": "motion.dev",
    "url": "https://motion.dev/",
    "source": "jsonlink"
    }
*/

import { useQuery, queryOptions } from '@tanstack/react-query';

import { apiMedia } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { LinkMetadata } from '@/types/api';

export const getLinkMetadata = ({
  url,
}: {
  url: string;
}): Promise<{ data: LinkMetadata }> => {
  return apiMedia.get(`/link-preview?url=${url}`);
};

export const getLinkMetadataQueryOptions = ({ url }: { url: string }) => {
  return queryOptions({
    queryKey: ['link-metadata', url],
    queryFn: () => getLinkMetadata({ url }),
  });
};
type UseLinkMetadataOptions = {
  url: string;
  queryConfig?: QueryConfig<typeof getLinkMetadataQueryOptions>;
};

export const useLinkMetadata = ({
  url,
  queryConfig,
}: UseLinkMetadataOptions) => {
  return useQuery({
    ...getLinkMetadataQueryOptions({ url }),
    ...queryConfig,
  });
};
