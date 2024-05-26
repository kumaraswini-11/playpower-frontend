import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { MdCalendarMonth } from "react-icons/md";

const CustomDatePicker = ({
  selectedDate,
  onChange,
  size,
  disabled = false,
}) => (
  <DatePicker
    disabled={disabled}
    selected={selectedDate}
    onChange={onChange}
    dateFormat="MMMM d, yyyy"
    placeholderText="Select Date"
    className="h-full w-full cursor-pointer rounded-md border text-sm outline-none disabled:cursor-not-allowed sm:w-auto"
    customInput={
      <div className="relative flex w-full items-center overflow-hidden rounded-md border border-gray-300 bg-bgColor-4">
        <label className="flex-1 py-2 pl-3 pr-10 disabled:cursor-not-allowed">
          {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select Date"}
        </label>
        <button
          className="absolute bottom-0 right-0 top-0 flex items-center justify-center bg-bgColor-3 p-2 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          <MdCalendarMonth className="text-textColor-3" size={size} />
        </button>
      </div>
    }
  />
);

export default CustomDatePicker;
