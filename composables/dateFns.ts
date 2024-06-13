import { format } from "date-fns";

export const useDateFns = (date: Date, resFormat: string) => {
  const result = format(date, resFormat);
  return result
}
