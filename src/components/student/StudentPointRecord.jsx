import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getExerciseApiClient } from '@/api/exerciseApiClient';
import styles from './css/StudentPointRecords.module.css';

function StudentPointRecord() {
  const navigate = useNavigate();
  const exerciseApiClient = getExerciseApiClient();
  const [currentPoints, setCurrentPoints] = useState(null);
  const [pointsRecords, setPointsRecords] = useState([]);

  useEffect(() => {
    fetchAndSetCurrentPoints();
    fetchAndSetPointsRecords();
  }, []);

  const fetchAndSetCurrentPoints = async () => {
    try {
      const response = await exerciseApiClient.get('/v1/student/points');
      setCurrentPoints(response.data.points);
    } catch (error) {
      console.error('Failed to fetch current points', error);
    }
  }

  const fetchAndSetPointsRecords = async () => {
    try {
      const response = await exerciseApiClient.get('/v1/student/points/records');
      setPointsRecords(response.data.pointsRecords);
    } catch (error) {
      console.error('Failed to fetch points records', error);
    }
  };

  return (
    <div>
      <div className="header-banner">
        <h3 className="text-orange">點數紀錄</h3>
        <button onClick={() => navigate('/student/dashboard')}>
          回主頁
        </button>
      </div><hr />

      {currentPoints !== null && (
        <div className={styles.currentPointsBox}>
          目前點數: <span className="text-orange">{currentPoints}</span>
        </div>
      )}

      {pointsRecords.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>異動點數</th>
              <th>
                說明
                <span className={styles.noteExplanation}>
                  (依操作時間排序，最新在最上方)
                </span>
              </th>
              <th>剩餘點數</th>
            </tr>
          </thead>
          <tbody>
            {pointsRecords.map((record) => (
              <tr key={record.id}>
                <td className={record.adjustedPoints > 0 ? styles.pointsPositive : styles.pointsNegative}>
                  {record.adjustedPoints > 0 ? `+${record.adjustedPoints}` : record.adjustedPoints}
                </td>
                <td className="text-white">{record.reason}</td>
                <td className="text-white text-bold">{record.pointsAfterAdjustment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>尚無點數紀錄</p>
      )}
    </div>
  );
}

export default StudentPointRecord;
