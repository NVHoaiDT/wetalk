import { default as dayjs } from 'dayjs';

export const formatDate = (date: number) =>
  dayjs(date).format('MMMM D, YYYY h:mm A');

export const formatBigNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};
