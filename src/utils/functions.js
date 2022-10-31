const arePointsNear = (checkPoint, centerPoint, km) => {
  let ky = 40000 / 360;

  let kx = Math.cos((Math.PI * centerPoint.latitude) / 180.0) * ky;

  let dx = Math.abs(centerPoint.longitude - checkPoint.longitude) * kx;

  let dy = Math.abs(centerPoint.latitude - checkPoint.latitude) * ky;

  return Math.sqrt(dx * dx + dy * dy) <= km;
};

const formatDateFromReq = (dateString) => {
  //TODO think about req date format
  let date = new Date(dateString);
  date = new Date(
    date.getFullYear(), //year YYYY
    date.getMonth(), //month 0-11 0=January
    date.getDate() + 1, //day 1-31
    0, //hours
    0, //minutes
    0, //seconds
    0 //milliseconds
  );
  return date;
};

const dateDayStringToInt = (dayString) => {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let dayInt = weekDays.findIndex((weekDay) => weekDay == dayString);
  return dayInt;
};

const dateDayIntToString = (dayInt) => {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let dayString = weekDays[dayInt];
  return dayString;
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

//#region schedule functions
const isScheduleFullyBooked = (schedule) => {
  let availableHour = schedule.find((hour) => !isHourFullyBooked(hour));
  if (availableHour) return false;
  else return true;
};

const isHourFullyBooked = (hour) => {
  let fullyBooked = hour.includes("available") ? false : true;
  return fullyBooked;
};

const getAvailableSlotIndeces = (schedule) => {
  // returns an array of each 15 min slot's index [hour,slot] in the schedule 2D array
  let availableSlotIndeces = [];

  schedule.foreach((hour, i) => {
    hour.foreach((slot, j) => {
      if (slot === "available") {
        availableSlotIndeces.push([i, j]);
      }
    });
  });

  return availableSlotIndeces;
};

const getAvailableStartSlotIndecesForAppointment = (
  schedule,
  appointmentTime
) => {
  //appointmentTime is in min and must be divisable by 15
  //ie. accepted values: 15,30,45,60,75,90,105..etc
  //return an array of the indeces of the start slots [hour,slot] for every group of consecutive slots that fit the appointment
  if (isScheduleFullyBooked(schedule)) return [];
  let numConsecutiveSlots = appointmentTime / 15;
  let scheduleAvailableSlots = getAvailableSlotIndeces(schedule);

  let startSlots = [];
  let i = 0;
  let j = 0;
  let prevSlot = scheduleAvailableSlots[i];
  let currSlot = scheduleAvailableSlots[j];
  let runningLength = 1;
  while (
    i < scheduleAvailableSlots.length &&
    j < scheduleAvailableSlots.length
  ) {
    let startSlot = scheduleAvailableSlots[i];
    if (runningLength === numConsecutiveSlots) {
      i += 1;
      j = i;
      runningLength = 1;
      startSlots.push([...startSlot]);
    } else {
      j++;
      if (j < scheduleAvailableSlots.length) {
        prevSlot = scheduleAvailableSlots[j - 1];
        currSlot = scheduleAvailableSlots[j];
        if (isSlotPairIndecesConsecutive(prevSlot, currSlot)) runningLength++;
        else {
          i = j;
          runningLength = 1;
        }
      }
    }
  }
};

const isSlotPairIndecesConsecutive = (slotIndex1, slotIndex2) => {
  let [hour1, slot1] = slotIndex1;
  let [hour2, slot2] = slotIndex2;
  if (hour1 === hour2 && slot2 - slot1 === 1)
    return true; //two consecutive slots in the same hour
  else if (hour2 - hour1 === 1 && slot2 === 0 && slot1 === 3)
    return true; //two slot across two consecutive hours, one at the end of the first hour, and one at the beginning of the second hour
  else return false;
};

const translateScheduleSlotIndexToSlotTimeString = (slotIndex) => {
  let [hour, slot] = slotIndex;
  const mins = ["00", "15", "30", "45"];
  const hours = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];
  return "" + hours[hour] + ":" + mins[slot] + "";
};

//#endregion

module.exports = {
  arePointsNear,
  dateDayStringToInt,
  dateDayIntToString,
  isScheduleFullyBooked,
  isHourFullyBooked,
  getAvailableSlotIndeces,
  getAvailableStartSlotIndecesForAppointment,
  isSlotPairIndecesConsecutive,
  translateScheduleSlotIndexToSlotTimeString,
  getDaysInMonth,
  formatDateFromReq,
};
