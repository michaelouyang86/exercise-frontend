import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, subMonths, subDays } from 'date-fns';

import { getExerciseApiClient } from '@/api/exerciseApiClient';
import styles from './css/TeacherClassPast.module.css';

function TeacherClassPast() {
  const navigate = useNavigate();
  const exerciseApiClient = getExerciseApiClient();
  // For past classes
  const [pastStartDate, setPastStartDate] = useState('');
  const [pastEndDate, setPastEndDate] = useState('');
  const [pastClasses, setPastClasses] = useState([]);

  useEffect(() => {
    const today = new Date();
    // Set default start date to the first day of the last month
    const startDate = format(startOfMonth(subMonths(today, 1)), 'yyyy-MM-dd');
    // Set default end date to yesterday
    const endDate = format(subDays(today, 1), 'yyyy-MM-dd');
    
    setPastStartDate(startDate);
    setPastEndDate(endDate);
    
    fetchAndSetPastClasses(startDate, endDate);
  }, []);

  const fetchAndSetPastClasses = async (startDate, endDate) => {
    try {
      const response = await exerciseApiClient.get('/v1/teacher/schedules', {
        params: { startDate, endDate }
      });
      setPastClasses(response.data.scheduledClasses);
    } catch (error) {
      console.error('Failed to fetch past classes', error);
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

  return (
    <div>
      <div className="header-banner">
        <h3 className="text-orange">完課紀錄</h3>
        <button onClick={() => navigate('/teacher/dashboard')}>
          回主頁
        </button>
      </div><hr />

      <div className={styles.dateFilterContainer}>
        <label>
          起始日期:
          <input
            type="date"
            value={pastStartDate}
            onChange={handlePastStartDateChange}
            className={styles.dateInput} />
        </label>
        <label>
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
            <th>學生</th>
            <th>日期</th>
            <th>時間</th>
          </tr>
        </thead>
        <tbody>
          {pastClasses.length > 0 ? (
            pastClasses.map((pastClass) => (
              <tr key={pastClass.id}>
                <td className="text-white">{pastClass.studentName}</td>
                <td className="text-white">{pastClass.classDate}</td>
                <td className="text-white">{pastClass.startTime.slice(0, 5)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className={styles.noSchedules}>
                沒有課程紀錄
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherClassPast;
