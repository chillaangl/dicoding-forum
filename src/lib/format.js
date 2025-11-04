import { formatDistanceToNow } from "date-fns";

export const formatDate = (iso) => formatDistanceToNow(new Date(iso), { addSuffix: true });
