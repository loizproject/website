import { format } from "date-fns";
export function formatDate(date) {
  const day = format(date, "d");
  let suffix;
  if (day > 3 && day < 21) suffix = "th";
  switch (day % 10) {
    case 1:
      suffix = "st";
    case 2:
      suffix = "nd";
    case 3:
      suffix = "rd";
    default:
      suffix = "th";
  }
  const month = format(date, "MMM");
  const formattedDate = `${month}${day}${suffix}`;
  return formattedDate;
}
