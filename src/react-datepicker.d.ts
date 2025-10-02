declare module 'react-datepicker' {
  import React from 'react';
  
  export interface ReactDatePickerProps {
    selected?: Date | null;
    onChange: (date: Date | null, event?: React.SyntheticEvent<any>) => void;
    dateFormat?: string | string[];
    showMonthDropdown?: boolean;
    showYearDropdown?: boolean;
    scrollableYearDropdown?: boolean;
    yearDropdownItemNumber?: number;
    showTimeSelect?: boolean;
    dropdownMode?: 'scroll' | 'select';
    placeholderText?: string;
    className?: string;
    wrapperClassName?: string;
    popperClassName?: string;
    isClearable?: boolean;
    minDate?: Date;
    maxDate?: Date;
    disabled?: boolean;
    readOnly?: boolean;
    autoComplete?: string;
    id?: string;
    name?: string;
    [key: string]: any;
  }
  
  const DatePicker: React.FC<ReactDatePickerProps>;
  export default DatePicker;
} 