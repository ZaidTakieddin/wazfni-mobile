import dayjs from "dayjs";
import "dayjs/locale/ar";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatDate = (date: string, format: string) => {
  return dayjs(date).locale("ar").format(format);
};

export const formatDateFromNow = (date: string) => {
  return dayjs(date).locale("ar").fromNow();
};

export const formatBirthDate = (date: string) => {
  return dayjs(date).locale("ar").fromNow(true);
};
