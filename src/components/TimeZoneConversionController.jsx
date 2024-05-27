import React, { useCallback, useRef, useState } from "react";
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
} from "../utils/dateTimeFormatter";
import CustomDatePicker from "./CustomDatePicker";
import ShareLinkSection from "./ShareLinkSection";
import useClickOutside from "../hooks/useClickOutside";

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
  const domNode = useClickOutside(() => setIsDropdownVisible(false));
  const [loading, setLoading] = useState(false);

  const generateShareLink = useCallback(() => {
    const currentUrl = window.location.origin;
    const datePart =
      includeDate && selectedIncludeDate
        ? formatDate(selectedIncludeDate.toLocaleDateString())
        : "";
    const timePart =
      includeTime && selectedTime ? formatTime(selectedTime) : "";
    const dateTimePart = [datePart, timePart].filter(Boolean).join("/");
    return `${currentUrl}/Timezone${dateTimePart ? `/${dateTimePart}` : ""}`;
  }, [includeDate, selectedIncludeDate, includeTime, selectedTime]);

  const debouncedApiCall = useCallback(
    _.debounce((query) => {
      const results = timeZones?.filter(
        (timeZone) =>
          timeZone.abbreviation.toLowerCase().includes(query.toLowerCase()) ||
          timeZone.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsDropdownVisible(results?.length > 0);
    }, 500),
    [timeZones]
  );

  const handleOnChange = useCallback(
    (event) => {
      const value = event.target.value;
      setInputValue(value);
      if (value.trim()) {
        setLoading(true);
        debouncedApiCall(value);
        setLoading(false);
      } else {
        setSearchResults([]);
        setIsDropdownVisible(false);
      }
    },
    [debouncedApiCall]
  );

  const handleOptionClick = useCallback(
    (selectedTimeZoneOption) => {
      setSelectedTimeZones((prevSelectedTimeZones) => [
        ...prevSelectedTimeZones,
        selectedTimeZoneOption,
      ]);
      setIsDropdownVisible(false);
      setInputValue("");
    },
    [setSelectedTimeZones]
  );

  return (
    <>
      <h1 className="mb-2 text-center text-3xl font-semibold underline">
        TimeZone Converter
      </h1>
      <section className="mb-2 rounded-sm bg-bgColor-2 p-4 shadow-md">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="relative">
            <div className="flex w-full items-center justify-start rounded-md border border-inherit bg-bgColor-2 text-textColor-2 shadow-inner sm:w-80">
              <input
                type="text"
                className="w-full rounded-sm bg-bgColor-4 py-3 pl-3 pr-12 text-sm outline-none"
                placeholder="Add Time Zone, City or Town"
                ref={inputRef}
                value={inputValue}
                onChange={handleOnChange}
              />
              <div className="absolute right-3 flex items-center">
                <span className="mx-2">|</span>
                {loading ? (
                  <svg
                    className="mr-3 h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                  ></svg>
                ) : (
                  <button
                    className="text-textColor-3 hover:opacity-80"
                    onClick={() => inputRef.current.focus()}
                  >
                    <FaPlus size={iconSize} />
                  </button>
                )}
              </div>
            </div>

            {isDropdownVisible && (
              <ul
                ref={domNode}
                className="absolute z-50 max-h-52 overflow-y-auto rounded-sm border border-gray-300 bg-bgColor-2 text-textColor-1 hover:text-textColor-3"
              >
                {searchResults?.map((result, index) => (
                  <li
                    key={`${result.abbreviation}-${index}`}
                    className="flex cursor-pointer items-center justify-between gap-1 p-2 hover:bg-bgColor-1"
                    onClick={() => handleOptionClick(result)}
                  >
                    <span>{result.abbreviation}</span>
                    <span>{result.name}</span>
                    <span>{result.currentTime}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

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
