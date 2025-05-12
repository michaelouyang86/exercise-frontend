import { useNavigate } from 'react-router-dom';

function StudentClassNote() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="header-banner">
        <h3 className="text-orange">課程筆記</h3>
        <button onClick={() => navigate('/student/dashboard')}>
          回主頁
        </button>
      </div><hr />

      <h2>待開發...</h2>
    </div>
  );
}

export default StudentClassNote;