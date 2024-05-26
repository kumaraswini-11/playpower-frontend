import React, { useState, useEffect } from "react";
import TimeZoneConversionController from "./components/TimeZoneConversionController";
import dragIcon from "./assets/dragIcon.svg";
import { fetchTimeData } from "./utils/fetchTimeData";
import useDragAndDrop from "./hooks/useDragAndDrop";

const TimeScale = ({ marks }) => {
  const [value, setValue] = useState(marks[0]);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <input
        type="range"
        value={value}
        min={marks[0]}
        max={marks[marks.length - 1]}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className="h-3 w-full cursor-pointer appearance-none rounded-md bg-bgColor-2"
      />
      <div className="flex w-full items-center justify-between gap-1">
        {marks.map((item, index) => (
          <span key={index} className="text-xs">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

const TimeZoneCard = ({ timeZone, index, dragHandlers }) => (
  <div className="flex items-center justify-start rounded-sm border hover:border-sky-500">
    <div
      className="h-full cursor-grab text-gray-800"
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

    <div className="flex flex-1 flex-col items-center gap-1 p-4 shadow-md">
      <div className="flex w-full items-center gap-2 text-2xl font-bold text-slate-700">
        <span className="flex-1">{timeZone.abbreviation}</span>
        <div className="mx-auto flex-1">
          <input
            type="text"
            className="w-72 rounded border border-gray-300 p-2 text-center shadow-inner outline-none focus:border-blue-400"
            defaultValue={timeZone.currentTime}
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-2 text-base text-gray-500">
        <label className="flex-1">{timeZone.name}</label>
        <label className="flex-1 text-center">{timeZone.timeZone}</label>
        <label className="flex-1 text-center">{timeZone.currentDate}</label>
      </div>
      <div className="w-full">
        <TimeScale marks={timeZone.marks} />
      </div>
    </div>
  </div>
);

const TimeZoneList = ({ items, setItems }) => {
  const dragHandlers = useDragAndDrop(items, setItems);

  return (
    <section className="space-y-2 py-0.5">
      {items?.map((item, index) => (
        <TimeZoneCard
          key={item.id}
          timeZone={item}
          index={index}
          dragHandlers={dragHandlers}
        />
      ))}
    </section>
  );
};

const App = () => {
  const [timeZones, setTimeZones] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedTimeZones, setSelectedTimeZones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const timeData = await fetchTimeData(
        "http://worldtimeapi.org/api/timezone"
      );
      setTimeZones(timeData);
    };

    fetchData();
  }, []);

  const handleSorting = () => {
    const sortedTimeZones = [...selectedTimeZones].sort((a, b) => {
      const comparison = a.abbreviation.localeCompare(b.abbreviation);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSelectedTimeZones(sortedTimeZones);
  };

  return (
    <main className="mx-auto grid max-w-5xl grid-cols-1 gap-2 border bg-bgColor-1 text-textColor-1">
      <TimeZoneConversionController
        handleSorting={handleSorting}
        setSelectedTimeZones={setSelectedTimeZones}
        timeZones={timeZones}
      />
      <TimeZoneList items={selectedTimeZones} setItems={setSelectedTimeZones} />
    </main>
  );
};

export default App;
