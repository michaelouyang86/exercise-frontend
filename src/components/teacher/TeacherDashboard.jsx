import { Link } from 'react-router-dom';

function TeacherDashboard() {
  return (
    <div>
      <h2>老師管理主頁</h2><hr />
      <h4>課程查詢</h4>
      <div className="links">
        <Link to="/teacher/" className="link">
          當日課程
        </Link>
        <Link to="/teacher/" className="link">
          自訂區間
        </Link>
      </div><br /><hr />

      <h4>管理上下班時間</h4>
      <div className="links">
        <Link to="/teacher/availability/recurring" className="link">
          每週循環設定
        </Link>
        <Link to="/teacher/availability/exceptions" className="link">
          個別日期設定
        </Link>
        <Link to="/teacher/unavailable-dates" className="link">
          休假設定
        </Link>
      </div><br /><hr />
    </div>
  );
}

export default TeacherDashboard;
