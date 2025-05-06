import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getISOWeek } from 'date-fns';

import exerciseApiClient from '@/api/exerciseApiClient';
import styles from './css/StudentClassSchedule.module.css';

function StudentClassSchedule() {
  const [teachers, setTeachers] = useState([]);
  const [selectedIsoWeek, setSelectedIsoWeek] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [teacherAvailabilities, setTeacherAvailabilities] = useState([]);
  const [selectedClassDate, setSelectedClassDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAndSetTeachers();
    setIsoWeekToNextWeek();
  }, []);

  const fetchAndSetTeachers = async () => {
    try {
      const response = await exerciseApiClient.get('/v1/student/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Failed to fetch teachers', error);
    }
  };

  const setIsoWeekToNextWeek = () => {
    const today = new Date();
    const nextWeekDate = new Date(today);
    // Adds 7 days to the current date
    nextWeekDate.setDate(today.getDate() + 7);

    const year = nextWeekDate.getFullYear();
    const isoWeek = getISOWeek(nextWeekDate);
    const nextIsoWeek = `${year}-W${isoWeek.toString().padStart(2, '0')}`;
    setSelectedIsoWeek(nextIsoWeek);
  };

  const handleTeacherChange = (event) => {
    setSelectedClassDate(null);
    setSelectedStartTime(null);

    const teacherId = event.target.value;
    setSelectedTeacherId(teacherId);
    fetchAndSetTeacherAvailabilities(teacherId, selectedIsoWeek);
  };

  const handleIsoWeekChange = (event) => {
    setSelectedClassDate(null);
    setSelectedStartTime(null);

    const isoWeek = event.target.value;
    setSelectedIsoWeek(isoWeek);
    fetchAndSetTeacherAvailabilities(selectedTeacherId, isoWeek);
  };

  const fetchAndSetTeacherAvailabilities = async (teacherId, isoWeek) => {
    if (teacherId && isoWeek) {
      try {
        const response = await exerciseApiClient.get(`/v1/student/teachers/${teacherId}/availabilities?isoWeek=${isoWeek}`);
        const filteredResponse = response.data.filter((availability) => availability.timeslots.length > 0);
        setTeacherAvailabilities(filteredResponse);
      } catch (error) {
        console.error('Failed to fetch availabilities', error);
      }
    } else {
      setTeacherAvailabilities([]);
    }
  };

  const handleTimeslotChange = (date, timeslot) => {
    setSelectedClassDate(date);
    setSelectedStartTime(timeslot);
  };

  const handleScheduleClass = async () => {
    try {
      const requestBody = {
        teacherId: selectedTeacherId,
        classDate: selectedClassDate,
        startTime: selectedStartTime
      };
      await exerciseApiClient.post('/v1/student/schedules', requestBody);
    
      const selectedTeacherName = teachers.find(teacher => teacher.id === Number(selectedTeacherId)).name;
      alert(`預約成功！\n\n教練: ${selectedTeacherName}\n日期: ${selectedClassDate}\n時間: ${selectedStartTime.slice(0, 5)}`);
      navigate('/student/class/management');
    } catch (error) {
      console.error('Failed to schedule class', error);
      alert(`預約失敗！\n\n請重新預約`);
    }
  };

  return (
    <div>
      <div className="header-banner">
        <h3 className="text-orange">預約課程</h3>
        <button onClick={() => navigate('/student/dashboard')}>
          回主頁
        </button>
      </div>
      <hr />
      <div>
        <h5>選擇教練</h5>
        <select onChange={handleTeacherChange}>
          <option value="">請選擇教練</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTeacherId && (
        <div className={styles.selectWeek}>
          <h5>選擇週次</h5>
          <input
            type="week"
            value={selectedIsoWeek}
            onChange={handleIsoWeekChange}
          />
        </div>
      )}

      {selectedTeacherId && (
        teacherAvailabilities.length > 0 ? (
          <div className={styles.selectAvailability}>
            <h5>選擇可預約時間</h5>
            {teacherAvailabilities.map((availability) => (
              <div key={availability.date} className={styles.availabilitySection}>
                <hr />
                <strong className="text-orange">
                  {availability.date} ({availability.dayOfWeek})
                </strong>
                <div className={styles.timeslotRadioGroup}>
                  {availability.timeslots.map((timeslot) => (
                    <label key={timeslot} className={styles.timeslotButton}>
                      <input
                        type="radio"
                        name="selectedTimeslot"
                        onChange={() => handleTimeslotChange(availability.date, timeslot)}
                      />
                      <span>{timeslot.slice(0, 5)}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noAvailability}>暫無可預約時間</div>
        )
      )}

      <hr />
      {selectedClassDate && selectedStartTime && (
        <button
          className={styles.scheduleButton}
          onClick={handleScheduleClass}
        >
          預約
        </button>
      )}
    </div>
  );
}

export default StudentClassSchedule;
