import { differenceInDays, differenceInHours, format } from 'date-fns';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { default as dayjs } from 'dayjs';

// Keep it as it is for now, we will mirgate to date-fns later
export const formatDate = (date: number | string) =>
  dayjs(date).format('MMMM D, YYYY h:mm A');

export const formatBigNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const formatDateFns = (date: number | string) => {
  const dateObj = new Date(date);
  const now = new Date();

  const daysDiff = differenceInDays(now, dateObj);
  const hoursDiff = differenceInHours(now, dateObj);

  // If older than 30 days, show actual date
  if (daysDiff > 30) {
    return format(dateObj, 'MMM d, yyyy');
  }

  // If within 30 days, show relative time
  let relativeTime = formatDistanceToNow(dateObj, { addSuffix: true });

  // Remove 'about' if older than 1 hour
  if (hoursDiff > 1) {
    relativeTime = relativeTime.replace(/^about /, '');
  }

  return relativeTime;
};
