export type DatePickerFormat = "monthYear" | "year";

export interface DatePickerFieldProps {
  label: string;
  value: string;
  onChangeValue: (value: string) => void;
  format: DatePickerFormat;
  placeholder: string;
  clearable?: boolean;
  error?: string;
}
