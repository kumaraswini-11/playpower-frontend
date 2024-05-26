import { nearestTimeSlot } from "../utils/dateTimeFormatter.js";
import CustomDatePicker from "./CustomDatePicker.jsx";

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
        />
      </div>
    </div>
  </div>
);

export default ShareLinkSection;
