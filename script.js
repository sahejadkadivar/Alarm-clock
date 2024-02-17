// Fetching all the span of current time
const curHour = document.getElementById("cur-hour");
const curMinute = document.getElementById("cur-minute");
const curSeconds = document.getElementById("cur-second");
let period = document.getElementById("cur-period");

// utility function to add prefix 0 to the number below value 10
function addZero(value) {
    return value < 10 ? `0${value}` : value;
}

// function to get local time
function localTime() {
    const date = new Date();
    let localhour = date.getHours();

    if (localhour >= 12) {
        period.innerHTML = "PM";
    } else {
        period.innerHTML = "AM";
    }

    // Converting  to 12-hour format
    localhour = localhour % 12 || 12; // If curhour is 0, set it to 12 - If the result is 0, it sets curhour to 12, ensuring that midnight (00:00) is represented as 12:00 AM in the 12-hour format.
    
    localhour = addZero(localhour);
    curHour.textContent = `${localhour}:`;
    let localmin = addZero(date.getMinutes());
    curMinute.textContent = `${localmin}:`;
    let localsec = addZero(date.getSeconds());
    curSeconds.textContent = `${localsec}`;
};

// calling localtime function to show local time
localTime();

// To continuously update the time, let's set an interval - it updates the time every second
setInterval(function () {
    localTime();
}, 1000)


// fetching audio file from audio folder

let alarmTone = new Audio("audio/alarm_tone.mp3");
let timeoutId;
let alarmCount = 0;
let alarms = {}; // Object to store alarm information (time, timeout)


// Set the alarm based on user input and displaying on the list using DOM
function setAlarm() {
    // fetching the user given inputs
  const alarmHour = parseInt(document.getElementById("alarm-hour").value, 10);
  const alarmMinute = parseInt(document.getElementById("alarm-minute").value, 10);
  const alarmSecond = parseInt(document.getElementById("alarm-second").value, 10);
  const alarmPeriod = document.getElementById("alarm-period-options");

  // Checking if user has entered valid time or not
  if (
    isNaN(alarmHour) ||
    isNaN(alarmMinute) ||
    isNaN(alarmSecond) ||
    alarmHour < 0 ||
    alarmHour > 12 ||
    alarmMinute < 0 ||
    alarmMinute > 59 ||
    alarmSecond < 0 ||
    alarmSecond > 59
  ) {
    alert("Please Set A valid time for alarm");
    return;
  }

  const selectedOption = alarmPeriod.options[alarmPeriod.selectedIndex].text;
//   to see in console if set alarm is working fine or not it is for developer only.
  console.log(
    `Alarm Set for:${addZero(alarmHour)}:${addZero(alarmMinute)}:${addZero(alarmSecond)} ${selectedOption}`
  );

  // creating new date object
  const newDate = new Date();
  if(alarmPeriod.selectedIndex==1 && alarmHour < 12){
    newDate.setHours(alarmHour+12); // it is case of 12PM noon
  }else if(alarmPeriod.selectedIndex==0 && alarmHour == 12){
    newDate.setHours(alarmHour-12); // This is for 12AM night
  }else{
    newDate.setHours(alarmHour);
  }
  
  newDate.setMinutes(alarmMinute);
  newDate.setSeconds(alarmSecond);

  // Adding Zeros using the addZero function
  const setHrs = addZero(newDate.getHours());
  const setMins = addZero(newDate.getMinutes());
  const setSec = addZero(newDate.getSeconds());
  
  const displayHour = addZero(setHrs%12 || 12)
  const setTime = `${displayHour}:${setMins}:${setSec}${selectedOption}`;

  //Displaying The Alarm in the alarm-list Div Using DOM

  const displayAlarm = document.getElementById("alarms-list");
  let listItem = document.createElement("li");
  let alarmText = document.createElement("span");
  const stopAlarmBtn = document.createElement("button");
  const deleteAlarmBtn = document.createElement("button");

  alarmText.textContent= `${setTime} 🔔`;
  stopAlarmBtn.textContent = "Stop";
  deleteAlarmBtn.textContent = "Delete";

  const alarmId = ++alarmCount;

  // Displaying the Alarm
  listItem.appendChild(alarmText);
  listItem.appendChild(stopAlarmBtn);
  listItem.appendChild(deleteAlarmBtn);

  displayAlarm.appendChild(listItem);

  // Stop The Alarm
  const alarmStop = () => {
    stopAlarm(alarmId);
  };

  // Delete The Alarm
  const alarmDelete = () => {
    alarmStop(alarmId);
    console.log("alarm Deleted");  // for developer confirmation if alarm is deleted or not
    listItem.remove();
  };

  // Button Events
  stopAlarmBtn.addEventListener("click", alarmStop);
  deleteAlarmBtn.addEventListener("click", alarmDelete);

  

  // Alarm Functionality
  const currentTime = new Date().getTime();
  const alarmTime = newDate.getTime();
  const timeDifference = alarmTime - currentTime; // getting difference to set timeout

//   below is also for developer reference
  console.log(`currentTime:${currentTime}`);
  console.log(`alarmTime:${alarmTime}`);
  console.log(`timeDifference:${timeDifference}`);

  const alarmInfo = {
    time: alarmTime,
    timeout: setTimeout(() => {
      if(timeDifference>0){
        playAlarm(alarmId);
      }
  },timeDifference),
  };

  alarms[alarmId] = alarmInfo;

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    playAlarm();
  }, timeDifference);

  // Clear Input Fields After Setting the Alarm
  document.getElementById("alarm-hour").value = "";
  document.getElementById("alarm-minute").value = "";
  document.getElementById("alarm-second").value = "";
  alarmPeriod.selectedIndex = 0;
}

// Play the alarm sound
function playAlarm(alarmId) {
  const alarmInfo = alarms[alarmId];

  if (alarmInfo) {
    alarmTone.loop = true;
    alarmTone.play();

    setTimeout(() => {
      console.log("Alarm is Ringing");
      alert(`The Alarm is Ringing`);
    }, 10);
  }
}

// Stop the alarm sound
function stopAlarm(alarmId) {
    alarmTone.pause();
    alarmTone.currentTime = 0;

  const alarmInfo = alarms[alarmId];
  if (alarmInfo) {
    clearTimeout(alarmInfo.timeout);
    delete alarms[alarmId];
  }
}
