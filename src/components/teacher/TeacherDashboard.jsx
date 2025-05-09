import { Link, useNavigate } from 'react-router-dom';

import styles from './css/TeacherDashboard.module.css';

function TeacherDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <h3>教練主頁</h3><hr />
      <h4 className="text-orange">課程查詢</h4>
      <div className="links">
        <Link to="/teacher/" className="link">
          當日課程
        </Link>
        <Link to="/teacher/" className="link">
          自訂區間
        </Link>
      </div><br /><hr />

      <h4 className="text-orange">管理上下班時間</h4>
      <div className="links">
        <Link to="/teacher/availabilities/recurring" className="link">
          每週循環設定
        </Link>
        <Link to="/teacher/availabilities/exception" className="link">
          個別日期設定
        </Link>
        <Link to="/teacher/availabilities/unavailable" className="link">
          休假設定
        </Link>
      </div><br /><hr />
      <button onClick={handleLogout} className={styles.logoutButton}>
        登出
      </button>
    </div>
  );
}

export default TeacherDashboard;
