import { Link } from 'react-router-dom';

function StudentDashboard() {
  return (
    <div>
      <h3>學生主頁</h3><hr />
      {/* 剩餘點數: 10 */}
      <div className="links">
        <Link to="/student/class/schedule" className="link">
          預約課程
        </Link>
        <Link to="/student/class/manage" className="link">
          課程查詢 & 管理
        </Link>
        <Link to="/student/class/note" className="link">
          課程筆記
        </Link>
      </div><br /><hr />
    </div>
  );
}

export default StudentDashboard;