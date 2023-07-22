const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getDateStr(date: Date) {
  const weekday = WEEKDAYS[date.getDay()];
  const month = MONTHS[date.getMonth()];
  const day = date.getDate();

  return `${weekday}, ${month} ${day}`;
}

export function getTimeStr(date: Date) {
  const dateTimezone = getTimezoneStr(date);
  let dateMinutes = "";
  let dateSuffix = "am";
  let dateHours = date.getHours();

  if (dateHours >= 12) {
    dateSuffix = "pm";

    if (dateHours !== 12) {
      dateHours = dateHours - 12;
    }
  } else if (dateHours === 0) {
    dateHours = 12;
  }

  if (date.getMinutes() !== 0) {
    if (date.getMinutes() < 10) {
      dateMinutes = `:0${date.getMinutes()}`;
    } else {
      dateMinutes = `:${date.getMinutes()}`;
    }
  }

  return `${dateHours}${dateMinutes}${dateSuffix} ${dateTimezone}`;
}

export function getDayTime(date: Date) {
  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const time = new Date().toString().split(" ")[4];

  // console.log("time", time);
  return `${month} ${day}, ${year} ${time}`;
}

export function getTimezoneStr(date: Date) {
  return date
    .toLocaleTimeString("en-us", { timeZoneName: "short" })
    .split(" ")[2];
}
