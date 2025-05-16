import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import WorkingHoursPicker from '@/components/common/WorkingHoursPicker';
import { getExerciseApiClient } from '@/api/exerciseApiClient';
import styles from './css/TeacherRecurringAvailability.module.css';

function TeacherRecurringAvailability() {
  const navigate = useNavigate();
  const exerciseApiClient = getExerciseApiClient();
  const [recurringAvailabilities, setRecurringAvailabilities] = useState([]);
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [workingTime, setWorkingTime] = useState({
    startHour: '',
    startMinute: '',
    endHour: '',
    endMinute: '',
  });

  useEffect(() => {
    fetchAndSetRecurringAvailabilities();
  }, []);

  const fetchAndSetRecurringAvailabilities = async () => {
    try {
      const response = await exerciseApiClient.get('/v1/teacher/availabilities/recurring');
      setRecurringAvailabilities(response.data.recurringAvailabilities);
    } catch (error) {
      console.error('Error fetching recurring availabilities:', error);
    }
  };

  const handleAdd = async () => {
    // Validation
    const { startHour, startMinute, endHour, endMinute } = workingTime;
    if (!dayOfWeek || !startHour || !startMinute || !endHour || !endMinute) {
      alert('請完整填寫星期與上下班時間');
      return;
    }
    // Add the new recurring availability
    try {
      const startTime = `${startHour}:${startMinute}`;
      const endTime = `${endHour}:${endMinute}`;
      await exerciseApiClient.post('/v1/teacher/availabilities/recurring', {
        dayOfWeek,
        startTime,
        endTime,
      });
      fetchAndSetRecurringAvailabilities();
    } catch (error) {
      console.error('Error adding recurring availability:', error);
    }
  };

  const handleDelete = async (recurringId) => {
    const confirmed = window.confirm('確定要刪除此循環設定嗎？');
    if (confirmed) {
      try {
        await exerciseApiClient.delete(`/v1/teacher/availabilities/recurring/${recurringId}`);
        fetchAndSetRecurringAvailabilities();
      } catch (error) {
        console.error('Error deleting recurring availability:', error);
      }
    }
  };

  return (
    <div>
      <div className="header-banner">
        <h3 className="text-orange">每週循環設定</h3>
        <button onClick={() => navigate('/teacher/dashboard')}>
          回主頁
        </button>
      </div><hr />

      <div className={styles.dayContainer}>
        星期:
        <select
          value={dayOfWeek}
          onChange={(event) => setDayOfWeek(event.target.value)}
          required
        >
          <option value="" disabled>請選擇</option>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      <WorkingHoursPicker
        workingTime={workingTime}
        setWorkingTime={setWorkingTime}
      />
      <button className={styles.addButton} onClick={handleAdd}>
        新增
      </button><hr />
      
      <h4>目前的循環設定</h4>
      <ul className={styles.recurringAvailabilities}>
        {recurringAvailabilities.map((availability) => (
          <li key={availability.id}>
            {availability.dayOfWeek} - {availability.startTime} ~ {availability.endTime}
            <button
              className={styles.deleteButton}
              onClick={() => handleDelete(availability.id)}
            >
              刪除
            </button>
          </li>
        ))}
      </ul>
      <hr />
    </div>
  );
}

export default TeacherRecurringAvailability;
