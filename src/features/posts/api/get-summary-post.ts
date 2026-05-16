/* 
Endpoint: POST API_AI/summarize
Body:
{
    "title": "Cho thuê căn góc 3PN 2WC tại HT Pearl, view hồ đá và Landmark 81",
    "content": "<p>Mình cho thuê căn góc 3PN 2WC tại HT Pearl với nội thất đầy đủ, view hồ đá và Landmark 81. Giá thuê 9tr5/tháng, liên hệ qua số điện thoại hoặc Facebook...</p>"
}
Response:
{
    "summary": "Mình cho thuê căn góc 3PN 2WC tại HT Pearl với nội thất đầy đủ, view hồ đá và Landmark 81. Giá thuê 9tr5/tháng, liên hệ qua số điện thoại hoặc Facebook..."
}
*/

import { queryOptions, useQuery } from '@tanstack/react-query';
import z from 'zod';

import { apiAI } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { SummayPost } from '@/types/api';

const getPlainTextFromHTML = (html: string): string => {
  // Create a temporary div element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Remove script and style elements
  const scripts = tempDiv.querySelectorAll('script, style');
  scripts.forEach((script) => script.remove());

  // Get text content and clean up whitespace
  const text = tempDiv.textContent || tempDiv.innerText || '';

  // Remove extra whitespace and newlines
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n+/g, ' ') // Replace newlines with space
    .trim();
};

const getSummaryPostInput = z.object({
  title: z.string(),
  content: z.string(),
});

export type GetSummaryPostInput = z.infer<typeof getSummaryPostInput>;

export const getSummaryPost = ({
  title,
  content,
}: GetSummaryPostInput): Promise<{ data: SummayPost }> => {
  const plainTextContent = getPlainTextFromHTML(content);

  return apiAI.post('/summarize', {
    title,
    content: plainTextContent,
  });
};

export const getSummaryPostQueryOptions = (data: GetSummaryPostInput) => {
  return queryOptions({
    /* 
        We don't need to cache this because we we user get new data every time 
        How can i even not cache this?
    */
    queryKey: ['posts', 'summary', data],
    queryFn: () => getSummaryPost(data),
  });
};

type UseSummaryPostOptions = {
  data: GetSummaryPostInput;
  queryConfig?: QueryConfig<typeof getSummaryPostQueryOptions>;
};

export const useSummaryPost = (
  { data, queryConfig }: UseSummaryPostOptions,
  additionalConfig?: { enabled?: boolean },
) => {
  return useQuery({
    ...getSummaryPostQueryOptions(data),
    ...queryConfig,
    ...additionalConfig,
  });
};
