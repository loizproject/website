import { format } from "date-fns";
export function formatDate(date) {
  const parsedDate = new Date(date);
  const day = parseInt(format(parsedDate, "d"), 10);

  let suffix = "th";
  if (day % 10 === 1 && day !== 11) suffix = "st";
  else if (day % 10 === 2 && day !== 12) suffix = "nd";
  else if (day % 10 === 3 && day !== 13) suffix = "rd";

  const month = format(parsedDate, "MMM");
  const year = format(parsedDate, "yyyy");

  return `${month} ${day}${suffix}, ${year}`;
}