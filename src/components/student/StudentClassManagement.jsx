import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import exerciseApiClient from '@/api/exerciseApiClient';
import styles from './css/StudentClassManagement.module.css';

function StudentClassManagement() {
  const [upcomingScheduledClasses, setUpcomingScheduledClasses] = useState([]);
  const [showPastClasses, setShowPastClasses] = useState(false);
  const [pastScheduledClasses, setPastScheduledClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAndSetUpcomingScheduledClasses();
  }, []);

  const fetchAndSetUpcomingScheduledClasses = async () => {
    try {
      const response = await exerciseApiClient.get('/v1/student/schedules/upcoming');
      setUpcomingScheduledClasses(response.data.scheduledClasses);
    } catch (error) {
      console.error('Failed to fetch upcoming schedules', error);
    }
  };

  const handleCancelSchedule = async (scheduleId) => {
    const confirmed = window.confirm('確定要取消這堂課程嗎？');
    if (confirmed) {
      try {
        await exerciseApiClient.delete(`/v1/student/schedules/${scheduleId}`);
        fetchAndSetUpcomingScheduledClasses();
      } catch (error) {
        console.error('Failed to cancel schedule', error);
      }
    }
  };

  const handleShowPastClasses = () => {
    fetchAndSetPastScheduledClasses();
    setShowPastClasses(true);
  };

  const fetchAndSetPastScheduledClasses = async () => {
    try {
      const response = await exerciseApiClient.get('/v1/student/schedules/past');
      setPastScheduledClasses(response.data.scheduledClasses);
    } catch (error) {
      console.error('Failed to fetch past schedules', error);
    }
  };

  return (
    <div>
      <div className="header-banner">
      <h4 className="text-orange">課程查詢 & 管理</h4>
        <button onClick={() => navigate('/student/dashboard')}>
          回主頁
        </button>
      </div><hr />
      <h5>預約的課程</h5>
      <table className="table">
        <thead>
          <tr>
            <th>教練</th>
            <th>日期</th>
            <th>時間</th>
            <th>取消預約</th>
          </tr>
        </thead>
        <tbody>
          {upcomingScheduledClasses.length > 0 ? (
            upcomingScheduledClasses.map((scheduledClass) => (
              <tr key={scheduledClass.id}>
                <td className="text-white">{scheduledClass.teacherName}</td>
                <td className="text-white">{scheduledClass.classDate}</td>
                <td className="text-white">{scheduledClass.startTime.slice(0, 5)}</td>
                <td>
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancelSchedule(scheduledClass.id)}
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

      <br /><hr />
      <h5>完成的課程</h5>
      {!showPastClasses && (
        <button onClick={handleShowPastClasses}>
          查詢
        </button>
      )}
      {showPastClasses && (
        <table className="table">
          <thead>
            <tr>
              <th>教練</th>
              <th>日期</th>
              <th>時間</th>
            </tr>
          </thead>
          <tbody>
            {pastScheduledClasses.length > 0 ? (
              pastScheduledClasses.map((pastScheduledClass) => (
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
      )}
    </div>
  );
}

export default StudentClassManagement;
