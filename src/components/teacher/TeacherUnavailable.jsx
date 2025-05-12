import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import exerciseApiClient from '@/api/exerciseApiClient';
import styles from './css/TeacherUnavailable.module.css';

function TeacherUnavailable() {
  const navigate = useNavigate();
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [unavailableDate, setUnavailableDate] = useState(null);

  useEffect(() => {
    fetchAndSetUnavailableDates();
  }, []);

  const fetchAndSetUnavailableDates = async () => {
    try {
      const response = await exerciseApiClient.get('/v1/teacher/availabilities/unavailable');
      setUnavailableDates(response.data.unavailableDates);
    } catch (error) {
      console.error('Error fetching unavailable dates:', error);
    }
  };

  const handleAdd = async () => {
    // Validation
    if (!unavailableDate) {
      alert('請填寫日期');
      return;
    }
    // Add the new unavailable date
    try {
      await exerciseApiClient.post('/v1/teacher/availabilities/unavailable', {
        unavailableDate,
      });
      fetchAndSetUnavailableDates();
    } catch (error) {
      console.error('Error adding unavailability:', error);
    }
  };

  const handleDelete = async (unavailableDateId) => {
    const confirmed = window.confirm('確定要刪除此休假嗎？');
    if (confirmed) {
      try {
        await exerciseApiClient.delete(`/v1/teacher/availabilities/unavailable/${unavailableDateId}`);
        fetchAndSetUnavailableDates();
      } catch (error) {
        console.error('Error deleting unavailability:', error);
      }
    }
  };

  return (
    <div>
      <div className="header-banner">
        <h3 className="text-orange">休假設定</h3>
        <button onClick={() => navigate('/teacher/dashboard')}>
          回主頁
        </button>
      </div><hr />

      休假設定優先於其他設定
      <div className={styles.dateContainer}>
        日期:
        <input
          type="date"
          value={unavailableDate}
          onChange={(event) => setUnavailableDate(event.target.value)}
          className={styles.dateInput}
          required
        />
      </div>

      <button className={styles.addButton} onClick={handleAdd}>
        放假
      </button><hr />
      
      <h4>目前的休假</h4>
      僅顯示今天 (含) 之後的休假
      <ul className={styles.unavailableDates}>
        {unavailableDates.map((unavailable) => (
          <li key={unavailable.id}>
            {unavailable.unavailableDate}
            <button
              className={styles.deleteButton}
              onClick={() => handleDelete(unavailable.id)}
            >
              刪除
            </button>
          </li>
        ))}
      </ul><hr />
    </div>
  );
}

export default TeacherUnavailable;
