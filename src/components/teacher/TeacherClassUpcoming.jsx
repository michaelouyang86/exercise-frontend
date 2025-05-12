import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';

import exerciseApiClient from '@/api/exerciseApiClient';
import styles from './css/TeacherClassUpcoming.module.css';

function TeacherClassUpcoming() {
  const navigate = useNavigate();
  // For today classes
  const [todayClasses, setTodayClasses] = useState([]);
  // For furture classes
  const [futureStartDate, setFutureStartDate] = useState(null);
  const [futureEndDate, setFutureEndDate] = useState(null);
  const [futureClasses, setFutureClasses] = useState([]);

  useEffect(() => {
    // Fetch today's classes
    fetchAndSetTodayClasses();

    // Fetch future classes
    const today = new Date();
    // Set default start date to tomorrow
    const startDate = format(addDays(today, 1), 'yyyy-MM-dd');
    // Set default end date to 7 days from today
    const endDate = format(addDays(today, 7), 'yyyy-MM-dd');
    setFutureStartDate(startDate);
    setFutureEndDate(endDate);
    fetchAndSetFutureClasses(startDate, endDate);
  }, []);

  const fetchAndSetTodayClasses = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const response = await exerciseApiClient.get('/v1/teacher/schedules', {
        params: { startDate: today, endDate: today }
      });
      setTodayClasses(response.data.scheduledClasses);
    } catch (error) {
      console.error('Failed to fetch today classes', error);
    }
  };

  const fetchAndSetFutureClasses = async (startDate, endDate) => {
    try {
      const response = await exerciseApiClient.get('/v1/teacher/schedules', {
        params: { startDate, endDate }
      });
      setFutureClasses(response.data.scheduledClasses);
    } catch (error) {
      console.error('Failed to fetch future classes', error);
    }
  };

  const handleFutureStartDateChange = (event) => {
    const newFutureStartDate = event.target.value;
    setFutureStartDate(newFutureStartDate);
    fetchAndSetFutureClasses(newFutureStartDate, futureEndDate);
  };

  const handleFutureEndDateChange = (event) => {
    const newFutureEndDate = event.target.value;
    setFutureEndDate(newFutureEndDate);
    fetchAndSetFutureClasses(futureStartDate, newFutureEndDate);
  };

  const handleCancelSchedule = async (scheduleId) => {
    const confirmed = window.confirm('確定要取消這堂課程嗎？');
    if (confirmed) {
      try {
        await exerciseApiClient.delete(`/v1/teacher/schedules/${scheduleId}`);
        // Refresh the classes after cancellation
        fetchAndSetTodayClasses();
        fetchAndSetFutureClasses(futureStartDate, futureEndDate);
      } catch (error) {
        console.error('Failed to cancel schedule', error);
      }
    }
  };

  return (
    <div>
      <div className="header-banner">
        <h3 className="text-orange">即將上課</h3>
        <button onClick={() => navigate('/teacher/dashboard')}>
          回主頁
        </button>
      </div><hr />
      
      <h5>今日課程</h5>
      <table className="table">
        <thead>
          <tr>
            <th>筆記</th>
            <th>學生</th>
            <th>時間</th>
            <th>取消</th>
          </tr>
        </thead>
        <tbody>
          {todayClasses.length > 0 ? (
            todayClasses.map((todayClass) => (
              <tr key={todayClass.id}>
                <td>
                  <button
                    className={styles.noteButton}
                    onClick={() => alert('待開發...')}
                  >
                    筆記
                  </button>
                </td>
                <td className="text-white">{todayClass.studentName}</td>
                <td className="text-white">{todayClass.startTime.slice(0, 5)}</td>
                <td>
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancelSchedule(todayClass.id)}
                  >
                    取消
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className={styles.noSchedules}>
                沒有預約的課程
              </td>
            </tr>
          )}
        </tbody>
      </table><hr />

      <h5>未來課程</h5>
      <div className={styles.dateFilterContainer}>
        <label className={styles.dateFilterLabel}>
          起始日期:
          <input
            type="date"
            value={futureStartDate}
            onChange={handleFutureStartDateChange}
            className={styles.dateInput} />
        </label>
        <label className={styles.dateFilterLabel}>
          結束日期:
          <input
            type="date"
            value={futureEndDate}
            onChange={handleFutureEndDateChange}
            className={styles.dateInput} />
        </label>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>學生</th>
            <th>日期</th>
            <th>時間</th>
            <th>取消</th>
          </tr>
        </thead>
        <tbody>
          {futureClasses.length > 0 ? (
            futureClasses.map((futureClass) => (
              <tr key={futureClass.id}>
                <td className="text-white">{futureClass.studentName}</td>
                <td className="text-white">{futureClass.classDate}</td>
                <td className="text-white">{futureClass.startTime.slice(0, 5)}</td>
                <td>
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancelSchedule(futureClass.id)}
                  >
                    取消
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className={styles.noSchedules}>
                沒有預約的課程
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherClassUpcoming;
