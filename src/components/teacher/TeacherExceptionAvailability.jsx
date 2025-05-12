import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import WorkingHoursPicker from '@/components/common/WorkingHoursPicker';
import exerciseApiClient from '@/api/exerciseApiClient';
import styles from './css/TeacherExceptionAvailability.module.css';

function TeacherExceptionAvailability() {
  const navigate = useNavigate();
  const [exceptionAvailabilities, setExceptionAvailabilities] = useState([]);
  const [exceptionDate, setExceptionDate] = useState(null);
  const [workingTime, setWorkingTime] = useState({
    startHour: '',
    startMinute: '',
    endHour: '',
    endMinute: '',
  });

  useEffect(() => {
    fetchAndSetExceptionAvailabilities();
  }, []);

  const fetchAndSetExceptionAvailabilities = async () => {
    try {
      const response = await exerciseApiClient.get('/v1/teacher/availabilities/exception');
      setExceptionAvailabilities(response.data.exceptionAvailabilities);
    } catch (error) {
      console.error('Error fetching exception availabilities:', error);
    }
  };

  const handleAdd = async () => {
    // Validation
    const { startHour, startMinute, endHour, endMinute } = workingTime;
    if (!exceptionDate || !startHour || !startMinute || !endHour || !endMinute) {
      alert('請完整填寫日期與上下班時間');
      return;
    }
    // Add the new exception availability
    try {
      const startTime = `${startHour}:${startMinute}`;
      const endTime = `${endHour}:${endMinute}`;
      await exerciseApiClient.post('/v1/teacher/availabilities/exception', {
        exceptionDate,
        startTime,
        endTime,
      });
      fetchAndSetExceptionAvailabilities();
    } catch (error) {
      console.error('Error adding exception availability:', error);
    }
  };

  const handleDelete = async (exceptionId) => {
    const confirmed = window.confirm('確定要刪除此個別日期設定嗎？');
    if (confirmed) {
      try {
        await exerciseApiClient.delete(`/v1/teacher/availabilities/exception/${exceptionId}`);
        fetchAndSetExceptionAvailabilities();
      } catch (error) {
        console.error('Error deleting exception availability:', error);
      }
    }
  };

  return (
    <div>
      <div className="header-banner">
        <h3 className="text-orange">個別日期設定</h3>
        <button onClick={() => navigate('/teacher/dashboard')}>
          回主頁
        </button>
      </div><hr />

      個別日期設定優先於「每週循環」
      <div className={styles.dateContainer}>
        日期:
        <input
          type="date"
          value={exceptionDate}
          onChange={(event) => setExceptionDate(event.target.value)}
          className={styles.dateInput}
          required
        />
      </div>

      <WorkingHoursPicker
        workingTime={workingTime}
        setWorkingTime={setWorkingTime}
      />
      <button className={styles.addButton} onClick={handleAdd}>
        新增
      </button><hr />
      
      <h4>目前的個別日期設定</h4>
      僅顯示今天 (含) 之後的設定
      <ul className={styles.exceptionAvailabilities}>
        {exceptionAvailabilities.map((availability) => (
          <li key={availability.id}>
            {availability.exceptionDate} - {availability.startTime} ~ {availability.endTime}
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

export default TeacherExceptionAvailability;
