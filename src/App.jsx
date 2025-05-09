import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UserLogin from './components/UserLogin';
import ProtectedRoute from './components/ProtectedRoute';

import StudentDashboard from './components/student/StudentDashboard';
import StudentClassSchedule from './components/student/StudentClassSchedule';
import StudentClassManagement from './components/student/StudentClassManagement';
import StudentPointRecord from './components/student/StudentPointRecord';
import StudentClassNote from './components/student/StudentClassNote';

import TeacherDashboard from './components/teacher/TeacherDashboard';
import TeacherRecurringAvailability from './components/teacher/TeacherRecurringAvailability';
import TeacherExceptionAvailability from './components/teacher/TeacherExceptionAvailability';
import TeacherUnavailable from './components/teacher/TeacherUnavailable';

// Import global CSS files
import './App.css';

function App() {
  const routes = [
    { path: '/', element: <UserLogin /> },
    
    { path: '/student/dashboard', element: <ProtectedRoute element={<StudentDashboard />} /> },
    { path: '/student/class/schedule', element: <ProtectedRoute element={<StudentClassSchedule />} /> },
    { path: '/student/class/management', element: <ProtectedRoute element={<StudentClassManagement />} /> },
    { path: '/student/point/records', element: <ProtectedRoute element={<StudentPointRecord />} /> },
    { path: '/student/class/note', element: <ProtectedRoute element={<StudentClassNote />} /> },

    { path: '/teacher/dashboard', element: <ProtectedRoute element={<TeacherDashboard />} /> },
    { path: '/teacher/availabilities/recurring', element: <ProtectedRoute element={<TeacherRecurringAvailability />} /> },
    { path: '/teacher/availabilities/exception', element: <ProtectedRoute element={<TeacherExceptionAvailability />} /> },
    { path: '/teacher/availabilities/unavailable', element: <ProtectedRoute element={<TeacherUnavailable />} /> }
  ];

  return (
    <Router>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App
