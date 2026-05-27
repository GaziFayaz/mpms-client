import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DATETIME_FORMAT = "hh:mm a dd-MMM-yyyy"
const DATE_ONLY_FORMAT = "dd-MMM-yyyy"

export function formatDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr)
    const timePart = dateStr.split("T")[1]
    const isDateOnly = !timePart || /^00:00:00/.test(timePart)

    if (isDateOnly) {
      const [y, m, d] = dateStr.substring(0, 10).split("-")
      return format(new Date(+y, +m - 1, +d), DATE_ONLY_FORMAT)
    }

    return format(date, DATETIME_FORMAT)
  } catch {
    return dateStr
  }
}
