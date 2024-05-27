import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { IoClose } from "react-icons/io5";
import TimeZoneConversionController from "./components/TimeZoneConversionController";
import dragIcon from "./assets/dragIcon.svg";
import { fetchTimeData } from "./utils/fetchTimeData";
import useDragAndDrop from "./hooks/useDragAndDrop";
import { adjustTimezone, convertToTimeFormat } from "./utils/dateTimeFormatter";

const TimeRangeSlider = ({
  time,
  setTime,
  minTime = 0,
  maxTime = 720,
  step = 15,
  signSteps = 60,
  labelSteps = 180,
}) => {
  const formatTime = (minutes) => {
    const date = new Date();
    date.setHours(0, minutes, 0);
    return format(date, "h:mm a");
  };

  const renderTickMarks = () => {
    const ticks = [];
    for (let i = minTime; i <= maxTime; i += step) {
      if (i % signSteps === 0) {
        const leftPercent = ((i - minTime) / (maxTime - minTime)) * 100;
        ticks.push(
          <div
            key={`tick-${i}`}
            className="absolute z-50 bg-slate-700"
            style={{
              left: `${leftPercent}%`,
              top: "5px",
              height: "12px",
              width: "1px",
            }}
          ></div>
        );
      }
    }
    return ticks;
  };

  const renderLabels = () => {
    const labels = [];
    for (let i = minTime; i <= maxTime; i += labelSteps) {
      const leftPercent = ((i - minTime) / (maxTime - minTime)) * 97;
      const hours = Math.floor(i / 60);
      const period = hours < 12 ? "am" : "pm";
      const displayHour = hours % 12 === 0 ? 12 : hours % 12;
      labels.push(
        <div
          key={`label-${i}`}
          className="absolute"
          style={{
            left: `${leftPercent}%`,
            top: "15px",
          }}
        >
          <span className="-translate-x-1/2 transform text-xs">
            {`${displayHour}${period}`}
          </span>
        </div>
      );
    }
    return labels;
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative h-2 w-full">
        {renderTickMarks()}
        {renderLabels()}
      </div>
      <input
        type="range"
        value={time}
        min={minTime}
        max={maxTime}
        step={step}
        onChange={(e) => setTime(formatTime(parseInt(e.target.value, 10)))}
        className="h-2 w-full cursor-pointer appearance-none rounded-md bg-bgColor-2"
        aria-labelledby="timeScale"
        style={{ position: "relative", zIndex: 1 }}
      />
    </div>
  );
};

const TimeZoneCard = ({ timeZone, index, dragHandlers, removeTimeZone }) => {
  const [time, setTime] = useState(convertToTimeFormat(timeZone.currentTime));
  const [formattedTime, setFormattedTime] = useState(timeZone.currentTime);

  useEffect(() => {
    // setFormattedTime(adjustTimezone(time, timeZone.timeZone));
    setFormattedTime(time);
  }, [time, timeZone.currentDate]);

  const handelClose = () => {
    removeTimeZone(index);
  };

  return (
    <div className="flex h-36 items-center justify-start rounded-sm border hover:border-sky-500">
      <div
        className="cursor-grab text-gray-800"
        draggable
        onDragStart={(e) => dragHandlers.handleDragStart(e, index)}
        onDragEnter={dragHandlers.handleDragEnter}
        onDragOver={dragHandlers.handleDragOver}
        onDrop={(e) => dragHandlers.handleDrop(e, index)}
      >
        {[...Array(3)].map((_, i) => (
          <img key={i} src={dragIcon} alt="Drag Icon" />
        ))}
      </div>

      <div className="relative flex flex-1 flex-col items-center gap-1 p-3 shadow-sm">
        <button
          className="absolute right-1.5 top-1 hover:text-red-500"
          onClick={handelClose}
        >
          <IoClose size={22} />
        </button>

        <div className="flex w-full items-center gap-2 text-2xl font-bold ">
          <span className="flex-1">{timeZone.abbreviation}</span>
          <div className="mx-auto flex-1">
            <input
              type="text"
              className="w-72 rounded border border-gray-300 p-2 text-center text-slate-700 shadow-inner outline-none focus:border-blue-400"
              value={formattedTime}
              readOnly
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-2 text-base">
          <label className="flex-1">{timeZone.name}</label>
          <label className="flex-1 text-center">{timeZone.timeZone}</label>
          <label className="flex-1 text-center">{timeZone.currentDate}</label>
        </div>
        <div className="w-full">
          <TimeRangeSlider time={time} setTime={setTime} />
        </div>
      </div>
    </div>
  );
};

const TimeZoneList = ({ items, setItems, removeTimeZone }) => {
  const dragHandlers = useDragAndDrop(items, setItems);

  return (
    <section className="space-y-2 py-0.5">
      {items.map((item, index) => (
        <TimeZoneCard
          key={item.id}
          timeZone={item}
          index={index}
          dragHandlers={dragHandlers}
          removeTimeZone={removeTimeZone}
        />
      ))}
    </section>
  );
};

const App = () => {
  const [timeZones, setTimeZones] = useState([]);
  const [selectedTimeZones, setSelectedTimeZones] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      const timeData = await fetchTimeData(
        "https://worldtimeapi.org/api/timezone"
      );
      setTimeZones(timeData);
    };

    fetchData();
  }, []);

  const handleSorting = () => {
    const sortedTimeZones = [...selectedTimeZones].sort((a, b) =>
      sortOrder === "asc"
        ? a.abbreviation.localeCompare(b.abbreviation)
        : b.abbreviation.localeCompare(a.abbreviation)
    );

    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSelectedTimeZones(sortedTimeZones);
  };

  const removeTimeZone = (index) => {
    setSelectedTimeZones((prevTimeZones) =>
      prevTimeZones.filter((_, i) => i !== index)
    );
  };

  return (
    <main className="mx-auto grid max-w-5xl grid-cols-1 gap-2 border bg-bgColor-1 text-textColor-1">
      <TimeZoneConversionController
        handleSorting={handleSorting}
        timeZones={timeZones}
        setSelectedTimeZones={setSelectedTimeZones}
      />
      <TimeZoneList
        items={selectedTimeZones}
        setItems={setSelectedTimeZones}
        removeTimeZone={removeTimeZone}
      />
    </main>
  );
};

export default App;
