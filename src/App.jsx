import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import UserLogin from './components/UserLogin';
import ProtectedRoute from './components/ProtectedRoute';

import StudentDashboard from './components/student/StudentDashboard';
import StudentClassSchedule from './components/student/StudentClassSchedule';
import StudentClassManage from './components/student/StudentClassManage';
import StudentClassNote from './components/student/StudentClassNote';

import TeacherDashboard from './components/teacher/TeacherDashboard';
import TeacherRecurringAvailability from './components/teacher/TeacherRecurringAvailability';
import TeacherExceptionAvailability from './components/teacher/TeacherExceptionAvailability';
import TeacherUnavailableDates from './components/teacher/TeacherUnavailableDates';

function App() {
  const routes = [
    { path: '/', element: <UserLogin /> },
    
    { path: '/student/dashboard', element: <ProtectedRoute element={<StudentDashboard />} /> },
    { path: '/student/class/schedule', element: <ProtectedRoute element={<StudentClassSchedule />} /> },
    { path: '/student/class/manage', element: <ProtectedRoute element={<StudentClassManage />} /> },
    { path: '/student/class/note', element: <ProtectedRoute element={<StudentClassNote />} /> },

    { path: '/teacher/dashboard', element: <ProtectedRoute element={<TeacherDashboard />} /> },
    { path: '/teacher/availability/recurring', element: <ProtectedRoute element={<TeacherRecurringAvailability />} /> },
    { path: '/teacher/availability/exceptions', element: <ProtectedRoute element={<TeacherExceptionAvailability />} /> },
    { path: '/teacher/unavailable-dates', element: <ProtectedRoute element={<TeacherUnavailableDates />} /> }
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
