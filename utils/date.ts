import type { DatePickerFormat } from "../components/DatePickerField.types";

export function parseDateValue(
  value: string,
  format: DatePickerFormat
): Date | null {
  if (format === "year" && /^\d{4}$/.test(value)) {
    return new Date(Number(value), 0, 1);
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)
    ? date
    : null;
}

export function serializeDateValue(
  date: Date,
  format: DatePickerFormat
): string {
  if (format === "year") {
    return String(date.getFullYear());
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateValue(
  value: string,
  format: DatePickerFormat
): string {
  if (!value) {
    return "";
  }

  const date = parseDateValue(value, format);
  if (!date) {
    return value;
  }

  if (format === "year") {
    return String(date.getFullYear());
  }

  return new Intl.DateTimeFormat("es", {
    month: "long",
    year: "numeric",
  }).format(date);
}
