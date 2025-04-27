import { useState, useEffect } from 'react';

import exerciseApiClient from '@/api/exerciseApiClient';
import axios from 'axios';

function StudentClassSchedule() {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [teacherAvailabilities, setTeacherAvailabilities] = useState([]);
  
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [isoWeek, setIsoWeek] = useState('2025-W16'); // default week for example

  const token = localStorage.getItem('token'); // Example: get auth token

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await exerciseApiClient.get('/student/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Failed to fetch teachers', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherAvailabilities = async (teacherId) => {
    try {
      setLoading(true);
      const response = await exerciseApiClient.get(`/student/teachers/${teacherId}/availabilities?isoWeek=2025-W16`);
      setTeacherAvailabilities(response.data);
    } catch (error) {
      console.error('Failed to fetch availabilities', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleClass = async () => {
    if (!selectedTeacherId || !selectedAvailability) {
      alert('Please select a teacher and availability first.');
      return;
    }

    try {
      setLoading(true);
      const requestBody = {
        teacherId: selectedTeacherId,
        timeslot: selectedAvailability, // Adjust field name depending on your API
      };

      await axios.post('/student/schedules', requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Class scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule class', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>預約課程</h3><hr />

      {loading && <p>Loading...</p>}

      <div>
        <h5>選擇老師</h5>
        <select onChange={(event) => {
          const teacherId = event.target.value;
          setSelectedTeacherId(teacherId);
          fetchTeacherAvailabilities(teacherId);
        }}>
          <option value="">請選擇老師</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      {teacherAvailabilities.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h5>選擇可預約時間</h5>
          <select onChange={(e) => setSelectedAvailability(e.target.value)}>
            <option value="">請選擇時間</option>
            {teacherAvailabilities.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.date} {slot.startTime} - {slot.endTime}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={handleScheduleClass}
        style={{ marginTop: '2rem', padding: '0.75rem 2rem', fontSize: '1rem' }}
      >
        預約
      </button>
    </div>
  );
}

export default StudentClassSchedule;
