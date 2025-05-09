import { Link, useNavigate } from 'react-router-dom';

import styles from './css/StudentDashboard.module.css';

function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <h2 className="text-orange">學生主頁</h2><hr />
      <div className="links">
        <Link to="/student/class/schedule" className="link">
          預約課程
        </Link>
        <Link to="/student/class/management" className="link">
          課程查詢 & 管理
        </Link>
        <Link to="/student/point/records" className="link">
          點數紀錄
        </Link>
        <Link to="/student/class/note" className="link">
          課程筆記
        </Link>
      </div><br /><hr />
      <button onClick={handleLogout} className={styles.logoutButton}>
        登出
      </button>
    </div>
  );
}

export default StudentDashboard;