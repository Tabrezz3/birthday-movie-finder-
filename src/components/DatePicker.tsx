import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';
import { DatePickerProps } from '../types';
import { motion, Variants } from 'framer-motion';

// Define animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};

const BirthdayDatePicker: React.FC<DatePickerProps> = ({ selectedDate, onChange }) => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 100; 

  return (
    <motion.div 
      className="font-sans mb-8 mx-auto px-4 md:px-6 py-6 bg-[#121212] bg-opacity-95 backdrop-blur-md rounded-2xl shadow-lg border border-[#00BCD4] max-w-[280px] sm:max-w-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 
        className="font-['Against'] text-xl sm:text-2xl mb-2 text-[#FFFFFF] text-center tracking-wider"
        variants={itemVariants}
      >
        When were you born?
      </motion.h2>
      <motion.p 
        className="text-sm text-[#AAAAAA] mb-5 text-center leading-relaxed"
        variants={itemVariants}
      >
        Select your birthday to discover movies released on that special day!
      </motion.p>
      <motion.div 
        className="flex justify-center items-center w-full"
        variants={itemVariants}
      >
        <div className="relative w-full">
          <DatePicker
            selected={selectedDate}
            onChange={onChange}
            dateFormat="MMMM d, yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            yearDropdownItemNumber={100}
            scrollableYearDropdown
            minDate={new Date(startYear, 0, 1)}
            maxDate={new Date()}
            placeholderText="Select your birthday"
            className="w-full px-4 py-3 border border-[#00BCD4] rounded-xl bg-[#121212] text-[#FFFFFF] text-center outline-none focus:ring-2 focus:ring-[#00BCD4] focus:border-transparent"
            wrapperClassName="w-full"
            popperClassName="birthday-datepicker-popper"
          />
        </div>
      </motion.div>

    </motion.div>
  );
};

export default BirthdayDatePicker; 