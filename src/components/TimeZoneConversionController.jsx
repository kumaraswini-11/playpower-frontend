import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import {
  MdCalendarMonth,
  MdDarkMode,
  MdOutlineLightMode,
} from "react-icons/md";
import { FaRegCalendarPlus, FaPlus } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { FiLink } from "react-icons/fi";
import { useTheme } from "./ThemeContext";
import {
  generateTimeOptions,
  nearestTimeSlot,
  formatTime,
  formatDate,
} from "../utils/dateTimeFormatter.js";

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

const IconButton = ({ icon, onClick, title }) => (
  <button
    className="flex w-full items-center justify-center rounded-sm border border-inherit px-6 py-3 text-sm font-medium shadow-sm transition duration-150 ease-in-out hover:bg-teal-100"
    onClick={onClick}
    title={title}
  >
    {icon}
  </button>
);

const ShareLinkSection = ({
  includeTime,
  includeDate,
  selectedIncludeDate,
  selectedTime,
  setIncludeTime,
  setIncludeDate,
  setSelectedIncludeDate,
  setSelectedTime,
  generateShareLink,
  iconSize,
  timeOptions,
}) => (
  <div className="mt-6">
    <input
      className="mb-4 w-full rounded-md border bg-bgColor-4 p-3 text-sm outline-none"
      value={generateShareLink()}
      readOnly
      placeholder="Shareable Link"
    />
    <div className="flex flex-col gap-4 sm:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center gap-4">
        <input
          type="checkbox"
          id="includeTime"
          className="form-checkbox bg-bgColor-4"
          checked={includeTime}
          onChange={() => {
            setIncludeTime((prev) => !prev);
            if (!includeTime) setSelectedTime(nearestTimeSlot(timeOptions));
          }}
        />
        <label htmlFor="includeTime" className="text-sm">
          Include Time
        </label>
        <select
          className={`ml-2 flex-1 rounded-md border bg-bgColor-4 p-2 text-sm outline-none ${
            includeTime ? "" : "pointer-events-none opacity-50"
          }`}
          onChange={(e) => setSelectedTime(e.target.value)}
          disabled={!includeTime}
          value={selectedTime}
        >
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-1 items-center gap-4">
        <input
          type="checkbox"
          id="includeDate"
          checked={includeDate}
          className="form-checkbox text-blue-500"
          onChange={() => {
            setIncludeDate((prev) => !prev);
            if (!includeDate) setSelectedIncludeDate(selectedIncludeDate);
          }}
        />
        <label htmlFor="includeDate" className="text-sm">
          Include Date
        </label>
        <CustomDatePicker
          selectedDate={selectedIncludeDate}
          onChange={setSelectedIncludeDate}
          size={iconSize}
          disabled={!includeDate}
          className="flex-1"
        />
      </div>
    </div>
  </div>
);

const TimeZoneConversionController = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [includeDate, setIncludeDate] = useState(false);
  const [includeTime, setIncludeTime] = useState(false);
  const [selectedIncludeDate, setSelectedIncludeDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [showShareLinkSection, setShowShareLinkSection] = useState(true);
  const { toggleTheme, theme } = useTheme();
  const iconSize = 18;
  const timeOptions = generateTimeOptions("09:30", "23:30", 30);

  const generateShareLink = () => {
    const currentUrl = window.location.origin;
    const datePart =
      includeDate && selectedIncludeDate
        ? formatDate(selectedIncludeDate.toLocaleDateString())
        : "";
    const timePart =
      includeTime && selectedTime ? formatTime(selectedTime) : "";
    const dateTimePart = [datePart, timePart].filter(Boolean).join("/");
    return `${currentUrl}/Timezone${dateTimePart ? `/${dateTimePart}` : ""}`;
  };

  return (
    <main className="mx-auto w-full max-w-5xl bg-bgColor-1 p-4 text-textColor-1">
      <h1 className="mb-4 text-center text-3xl font-semibold underline">
        UTC To IST Converter
      </h1>

      <section className="rounded-sm bg-bgColor-2 p-6 shadow-md">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="relative flex w-full items-center justify-start rounded-md border border-inherit bg-bgColor-2 text-textColor-2 shadow-inner sm:w-80">
            <input
              type="text"
              className="w-full rounded-md bg-bgColor-4 py-3 pl-3 pr-12 text-sm outline-none"
              placeholder="Add Time Zone, City or Town"
            />
            <div className="absolute right-3 flex items-center">
              <span className="mx-2">|</span>
              <button className="text-textColor-3 hover:opacity-80">
                <FaPlus size={iconSize} />
              </button>
            </div>
          </div>
          <CustomDatePicker
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            size={iconSize}
          />
          <div className="flex w-full items-center text-textColor-3 sm:w-auto sm:justify-end">
            <IconButton icon={<FaRegCalendarPlus size={iconSize} />} />
            <IconButton icon={<BiSortAlt2 size={iconSize} />} />
            <IconButton
              icon={<FiLink size={iconSize} />}
              onClick={() => setShowShareLinkSection((prev) => !prev)}
            />
            <IconButton
              icon={
                theme === "light" ? (
                  <MdDarkMode size={iconSize} />
                ) : (
                  <MdOutlineLightMode size={iconSize} />
                )
              }
              onClick={toggleTheme}
              title={
                theme === "light"
                  ? "Switch to Dark Mode"
                  : "Switch to Light Mode"
              }
            />
          </div>
        </div>
        {showShareLinkSection && (
          <ShareLinkSection
            includeTime={includeTime}
            includeDate={includeDate}
            selectedIncludeDate={selectedIncludeDate}
            selectedTime={selectedTime}
            setIncludeTime={setIncludeTime}
            setIncludeDate={setIncludeDate}
            setSelectedIncludeDate={setSelectedIncludeDate}
            setSelectedTime={setSelectedTime}
            generateShareLink={generateShareLink}
            iconSize={iconSize}
            timeOptions={timeOptions}
          />
        )}
      </section>
    </main>
  );
};

export default TimeZoneConversionController;
