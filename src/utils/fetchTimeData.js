import axios from "axios";

export const fetchTimeData = async (baseUrl) => {
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
