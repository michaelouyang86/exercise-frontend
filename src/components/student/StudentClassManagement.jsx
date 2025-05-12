import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, subMonths, subDays } from 'date-fns';

import exerciseApiClient from '@/api/exerciseApiClient';
import styles from './css/StudentClassManagement.module.css';

function StudentClassManagement() {
  const navigate = useNavigate();
  // For upcoming classes
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  // For past classes
  const [pastStartDate, setPastStartDate] = useState(null);
  const [pastEndDate, setPastEndDate] = useState(null);
  const [pastClasses, setPastClasses] = useState([]);

  useEffect(() => {
    // Fetch upcoming classes
    fetchAndSetUpcomingClasses();

    // Fetch past classes
    const today = new Date();
    // Set default start date to the first day of the last month
    const startDate = format(startOfMonth(subMonths(today, 1)), 'yyyy-MM-dd');
    // Set default end date to yesterday
    const endDate = format(subDays(today, 1), 'yyyy-MM-dd');
    setPastStartDate(startDate);
    setPastEndDate(endDate);
    fetchAndSetPastClasses(startDate, endDate);
  }, []);

  const fetchAndSetUpcomingClasses = async () => {
    try {
      const response = await exerciseApiClient.get('/v1/student/schedules');
      setUpcomingClasses(response.data.scheduledClasses);
    } catch (error) {
      console.error('Failed to fetch upcoming schedules', error);
    }
  };

  const fetchAndSetPastClasses = async (startDate, endDate) => {
    try {
      const response = await exerciseApiClient.get('/v1/student/schedules', {
        params: { startDate, endDate }
      });
      setPastClasses(response.data.scheduledClasses);
    } catch (error) {
      console.error('Failed to fetch past schedules', error);
    }
  };

  const handlePastStartDateChange = (event) => {
    const newPastStartDate = event.target.value;
    setPastStartDate(newPastStartDate);
    fetchAndSetPastClasses(newPastStartDate, pastEndDate);
  };

  const handlePastEndDateChange = (event) => {
    const newPastEndDate = event.target.value;
    setPastEndDate(newPastEndDate);
    fetchAndSetPastClasses(pastStartDate, newPastEndDate);
  };

  const handleCancelSchedule = async (scheduleId) => {
    const confirmed = window.confirm('確定要取消這堂課程嗎？');
    if (confirmed) {
      try {
        await exerciseApiClient.delete(`/v1/student/schedules/${scheduleId}`);
        fetchAndSetUpcomingClasses();
      } catch (error) {
        console.error('Failed to cancel schedule', error);
      }
    }
  };

  return (
    <div>
      <div className="header-banner">
        <h4>課程查詢 & 管理</h4>
        <button onClick={() => navigate('/student/dashboard')}>
          回主頁
        </button>
      </div><hr />

      <h5 className="text-orange">即將上課</h5>
      <table className="table">
        <thead>
          <tr>
            <th>教練</th>
            <th>日期</th>
            <th>時間</th>
            <th>取消</th>
          </tr>
        </thead>
        <tbody>
          {upcomingClasses.length > 0 ? (
            upcomingClasses.map((upcomingClass) => (
              <tr key={upcomingClass.id}>
                <td className="text-white">{upcomingClass.teacherName}</td>
                <td className="text-white">{upcomingClass.classDate}</td>
                <td className="text-white">{upcomingClass.startTime.slice(0, 5)}</td>
                <td>
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancelSchedule(upcomingClass.id)}
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

      <h5 className="text-orange">完課紀錄</h5>
      <div className={styles.dateFilterContainer}>
        <label className={styles.dateFilterLabel}>
          起始日期:
          <input
            type="date"
            value={pastStartDate}
            onChange={handlePastStartDateChange}
            className={styles.dateInput} />
        </label>
        <label className={styles.dateFilterLabel}>
          結束日期:
          <input
            type="date"
            value={pastEndDate}
            onChange={handlePastEndDateChange}
            className={styles.dateInput} />
        </label>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>教練</th>
            <th>日期</th>
            <th>時間</th>
          </tr>
        </thead>
        <tbody>
          {pastClasses.length > 0 ? (
            pastClasses.map((pastScheduledClass) => (
              <tr key={pastScheduledClass.id}>
                <td className="text-white">{pastScheduledClass.teacherName}</td>
                <td className="text-white">{pastScheduledClass.classDate}</td>
                <td className="text-white">{pastScheduledClass.startTime.slice(0, 5)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className={styles.noSchedules}>
                沒有完成的課程
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default StudentClassManagement;
