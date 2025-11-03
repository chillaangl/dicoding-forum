import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

export const formatDate = (iso) =>
  formatDistanceToNow(new Date(iso), {
    addSuffix: true,
    locale: enUS,
  });
