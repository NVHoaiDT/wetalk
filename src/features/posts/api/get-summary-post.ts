/* 
Endpoint: POST API_AI/summarize
Body:
{
    "text": "Mình pass căn góc 3PN 2WC - HT Pearl. Ban công và hai phòng ngủ có cửa sổ hướng về hồ đá, rất mát mẻ. Phòng ngủ còn lại view Landmark 81.Nội thất gồm:+ 3 máy lạnh (mỗi phòng ngủ một máy lạnh)+ 2 giường có nệm, ga, gối đầy đủ+ 2 bộ bàn ghế bằng gỗ (có kệ sách)+ 3 tủ quần áo+ 1 bếp từ+ 1 máy hút mùi+ 1 dàn phơi+ full rèm cửa+ 1 lò vi sóng+ 1 bộ sofa. Có thể dọn vào ở vào cuối tháng 11 hoặc đầu tháng 12. Giá mình đang thuê là 9tr5/tháng - cọc 2 tháng. Liên hệ: 0362826041(Gọi điện) / 0914484221(Zalo) hoặc mn có thể nhắn tin trực tiếp qua Facebook của mình/các bạn được tag",
    "src_lang": "vi", --> fixed value
    "tgt_lang": "vi", --> fixed value
    "max_input_length": 512,
    "max_summary_length": 128
}
Response:
{
    "summary": "Mình cho thuê căn góc 3PN 2WC tại HT Pearl với nội thất đầy đủ, view hồ đá và Landmark 81. Giá thuê 9tr5/tháng, liên hệ qua số điện thoại hoặc Facebook..."
}

Backend note:
If content lenght around 500 - 600 words:
    max_input_length: 512
    max_summary_length: 128
If content lenght longer, scale up...
*/

import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiAI } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { SummayPost } from '@/types/api';

const calculateTokenLengths = (text: string) => {
  const wordCount = text.split(' ').length;
  if (wordCount < 512) {
    return { maxInputLength: 512, maxSummaryLength: 128 };
  }
  if (wordCount < 1024) {
    return { maxInputLength: 1024, maxSummaryLength: 256 };
  }
  if (wordCount < 2048) {
    return { maxInputLength: 2048, maxSummaryLength: 512 };
  }
  return { maxInputLength: 4096, maxSummaryLength: 1024 };
};

export const getSummaryPost = ({
  text,
}: {
  text: string;
}): Promise<{ data: SummayPost }> => {
  const { maxInputLength, maxSummaryLength } = calculateTokenLengths(text);
  return apiAI.post('/summarize', {
    text,
    src_lang: 'vi',
    tgt_lang: 'vi',
    max_input_length: maxInputLength,
    max_summary_length: maxSummaryLength,
  });
};

export const getSummaryPostQueryOptions = (text: string) => {
  return queryOptions({
    /* 
        We don't need to cache this because we we user get new data every time 
        How can i even not cache this?
    */
    queryKey: ['posts', 'summary', text],
    queryFn: () => getSummaryPost({ text }),
  });
};

type UseSummaryPostOptions = {
  text: string;
  queryConfig?: QueryConfig<typeof getSummaryPostQueryOptions>;
};

export const useSummaryPost = ({
  text,
  queryConfig,
}: UseSummaryPostOptions) => {
  return useQuery({
    ...getSummaryPostQueryOptions(text),
    ...queryConfig,
  });
};
