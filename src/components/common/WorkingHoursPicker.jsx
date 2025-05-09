import styles from './css/WorkingHoursPicker.module.css';

function WorkingHoursPicker({ workingTime, setWorkingTime }) {
  // 00 to 23
  const startHourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minuteOptions = ['00', '30'];

  const handleWorkingTimeStartHourChange = (event) => {
    setWorkingTime((prevState) => ({
      ...prevState,
      startHour: event.target.value,
      // Reset end hour when start hour changes
      endHour: '',
    }));
  };

  const handleWorkingTimeStartMinuteChange = (event) => {
    setWorkingTime((prevState) => ({
      ...prevState,
      startMinute: event.target.value,
      // Keep start and end minutes the same
      endMinute: event.target.value, 
    }));
  };

  const handleWorkingTimeEndHourChange = (event) => {
    setWorkingTime((prevState) => ({
      ...prevState,
      endHour: event.target.value
    }));
  };

  const getEndHourOptions = () => {
    if (workingTime.startHour) {
      const startHour = parseInt(workingTime.startHour, 10);
      return startHourOptions
        .filter((hour) => parseInt(hour, 10) > startHour)
        .concat("24"); // Add 24 as an option for end hour
    }
    return [];
  };

  return (
    <div>
      <div className={styles.timePickerRow}>
        <label>上班時間:</label>
        <select
          value={workingTime.startHour}
          onChange={handleWorkingTimeStartHourChange}
        >
          <option value="" disabled>--</option>
          {startHourOptions.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
        <span className={styles.colon}>:</span>
        <select
          value={workingTime.startMinute}
          onChange={handleWorkingTimeStartMinuteChange}
        >
          <option value="" disabled>--</option>
          {minuteOptions.map((minute) => (
            <option key={minute} value={minute}>{minute}</option>
          ))}
        </select>
      </div>

      <div className={styles.timePickerRow}>
        <label>下班時間:</label>
        <select
          value={workingTime.endHour}
          onChange={handleWorkingTimeEndHourChange}
        >
          <option value="" disabled>--</option>
          {getEndHourOptions().map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
        <span className={styles.colon}>:</span>
        <select
          value={workingTime.endMinute}
          disabled
        >
          <option value="" disabled>--</option>
          <option value={workingTime.endMinute}>
            {workingTime.endMinute}
          </option>
        </select>
      </div>
    </div>
  );
}

export default WorkingHoursPicker;
