export interface CNSelectOption {
  index: number;
  label: string;
  value: any;
}
export interface CrmInput {
  name: string;
  type: string;
  label?: string;
  infoIconName?: string;
  placeholder?: string;
  required?: boolean;
  trimNotRequired?: boolean;
  trim?: boolean;
  number?: boolean;
  numberWithDigit?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  inactive?: boolean;
  options?: CNSelectOption[];
  interface?: string;
  pattern?: string;
}
