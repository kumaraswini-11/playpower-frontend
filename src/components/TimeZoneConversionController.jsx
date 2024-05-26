import React, { useCallback, useRef, useState, useEffect } from "react";
import _ from "lodash";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { FaRegCalendarPlus, FaPlus } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { FiLink } from "react-icons/fi";
import { useTheme } from "./ThemeContext";
import {
  generateTimeOptions,
  formatTime,
  formatDate,
} from "../utils/dateTimeFormatter.js";
import CustomDatePicker from "./CustomDatePicker.jsx";
import ShareLinkSection from "./ShareLinkSection.jsx";

const IconButton = ({ icon, onClick, title }) => (
  <button
    className="flex w-full items-center justify-center rounded-sm border border-inherit px-6 py-3 text-sm font-medium shadow-sm transition duration-150 ease-in-out hover:bg-teal-100"
    onClick={onClick}
    title={title}
  >
    {icon}
  </button>
);

const TimeZoneConversionController = ({
  handleSorting,
  timeZones,
  setSelectedTimeZones,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [includeDate, setIncludeDate] = useState(false);
  const [includeTime, setIncludeTime] = useState(false);
  const [selectedIncludeDate, setSelectedIncludeDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [showShareLinkSection, setShowShareLinkSection] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { toggleTheme, theme } = useTheme();
  const iconSize = 18;
  const timeOptions = generateTimeOptions("09:30", "23:30", 30);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

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

  const handleOnChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (value.trim()) {
      debouncedApiCall(value);
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  };

  const handleOptionClick = (selectedTimeZoneOption) => {
    setSelectedTimeZones(selectedTimeZoneOption);
    setIsDropdownVisible(false);
    setInputValue("");
  };

  const debouncedApiCall = useCallback(
    _.debounce((query) => {
      const results = timeZones.filter(
        (timeZone) =>
          timeZone.abbreviation.toLowerCase().includes(query.toLowerCase()) ||
          timeZone.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsDropdownVisible(results.length > 0);
    }, 500),
    [timeZones]
  );

  return (
    <>
      <h1 className="mb-4 text-center text-3xl font-semibold underline">
        UTC To IST Converter
      </h1>
      <section className="mb-2 rounded-sm bg-bgColor-2 p-6 shadow-md">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="relative flex w-full items-center justify-start rounded-md border border-inherit bg-bgColor-2 text-textColor-2 shadow-inner sm:w-80">
            <input
              type="text"
              className="w-full rounded-md bg-bgColor-4 py-3 pl-3 pr-12 text-sm outline-none"
              placeholder="Add Time Zone, City or Town"
              ref={inputRef}
              value={inputValue}
              onChange={handleOnChange}
            />
            <div className="absolute right-3 flex items-center">
              <span className="mx-2">|</span>
              <button
                className="text-textColor-3 hover:opacity-80"
                onClick={() => inputRef.current.focus()}
              >
                <FaPlus size={iconSize} />
              </button>
            </div>
          </div>
          {isDropdownVisible && (
            <ul className="absolute mt-1 max-h-60 overflow-y-auto rounded-md border border-gray-300 bg-white">
              {searchResults?.map((result, index) => (
                <li
                  key={index}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                  onClick={() => handleOptionClick(result)}
                >
                  {result.abbreviation} - {result.name} - {result.currentTime}
                </li>
              ))}
            </ul>
          )}

          <CustomDatePicker
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            size={iconSize}
          />
          <div className="flex w-full items-center text-textColor-3 sm:w-auto sm:justify-end">
            <IconButton icon={<FaRegCalendarPlus size={iconSize} />} />
            <IconButton
              icon={<BiSortAlt2 size={iconSize} />}
              onClick={handleSorting}
            />
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
    </>
  );
};

export default TimeZoneConversionController;
