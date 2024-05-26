import { useState, useEffect } from "react";
import axios from "axios";

const fetchTimeData = async (baseUrl) => {
  try {
    const response = await axios.get(baseUrl);
    const timezones = response.data;

    const timeDataArray = await Promise.all(
      timezones.map(async (timezone) => {
        try {
          const timezoneResponse = await axios.get(`${baseUrl}/${timezone}`);
          const timezoneInfo = timezoneResponse.data;
          return {
            id: timezone,
            abbreviation: timezoneInfo.abbreviation,
            name: timezone,
            currentTime: timezoneInfo.datetime.split(".")[0].replace("T", " "),
            timeZone: timezoneInfo.utc_offset,
            currentDate: timezoneInfo.datetime.split("T")[0],
            marks: [0, 25, 50, 75, 100], // Assuming marks for TimeScale
          };
        } catch (err) {
          console.error(`Failed to get data for timezone: ${timezone}`, err);
          return null;
        }
      })
    );

    return timeDataArray.filter((data) => data !== null);
  } catch (err) {
    console.error("Failed to fetch time data", err);
    return [];
  }
};

const useTimezoneData = () => {
  const [timeData, setTimeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTimeData("http://worldtimeapi.org/api/timezone");
      setTimeData(data);
    };

    fetchData();
  }, []);

  return { timeData };
};

export default useTimezoneData;
