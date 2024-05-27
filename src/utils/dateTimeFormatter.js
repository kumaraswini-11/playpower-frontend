import {
  format,
  addMinutes,
  parse,
  isBefore,
  isEqual,
  closestTo,
} from "date-fns";

export const generateTimeOptions = (startTime, endTime, interval) => {
  const options = [];
  const start = parse(startTime, "HH:mm", new Date());
  const end = parse(endTime, "HH:mm", new Date());
  let currentTime = start;

  while (isBefore(currentTime, end) || isEqual(currentTime, end)) {
    options.push(format(currentTime, "hh:mm a"));
    currentTime = addMinutes(currentTime, interval);
  }

  return options;
};

export const nearestTimeSlot = (timeSlots) => {
  const currentTime = new Date();
  const parsedTimeSlots = timeSlots.map((time) =>
    parse(time, "hh:mm aa", new Date())
  );
  const nearestSlot = closestTo(currentTime, parsedTimeSlots);
  return format(nearestSlot, "hh:mm aa");
};

export const formatTime = (inputTime) => {
  const parsedTime = parse(inputTime, "h:mm a", new Date());
  const formattedHour = format(parsedTime, "h");
  const formattedMinute = format(parsedTime, "m");
  const period = format(parsedTime, "a").toLowerCase();
  return `${formattedHour}${formattedMinute !== "0" ? `-${formattedMinute}` : ""}${period}`;
};

export const formatDate = (inputDate) => {
  if (!inputDate) return "";
  const parsedDate = parse(inputDate, "dd/MM/yyyy", new Date());
  return format(parsedDate, "MMM-dd-yyyy").toLowerCase();
};

export const adjustTimezone = (time, offset) => {
  const [timePart, period] = time.split(" ");
  const [hours, minutes] = timePart.split(":").map(Number);

  let adjustedHours = hours;
  if (period === "PM" && hours !== 12) {
    adjustedHours += 12;
  } else if (period === "AM" && hours === 12) {
    adjustedHours = 0;
  }

  let date = new Date();
  date.setHours(adjustedHours, minutes);

  const [offsetHours, offsetMinutes] = offset.split(":").map(Number);
  const totalOffsetMinutes = offsetHours * 60 + (offsetMinutes || 0);

  date = addMinutes(date, totalOffsetMinutes);

  return format(date, "h:mm a");
};

export const convertToTimeFormat = (dateTimeString) => {
  const date = parse(dateTimeString, "yyyy-MM-dd HH:mm:ss", new Date());
  return format(date, "h:mm a");
};
