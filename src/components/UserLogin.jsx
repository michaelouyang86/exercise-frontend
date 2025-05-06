import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import exerciseApiClient from '@/api/exerciseApiClient';

function UserLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage('');
    
    // Clear any existing role and token in localStorage
    localStorage.removeItem('role');
    localStorage.removeItem('token');

    try {
      const response = await exerciseApiClient.post('/v1/authentication/users', {
        phone,
        password,
      });

      const { role, token } = response.data;
      localStorage.setItem('role', role);
      localStorage.setItem('token', token);

      // Navigate to the appropriate dashboard based on the role
      if (role === 'STUDENT') {
        navigate('/student/dashboard');
      } else if (role === 'TEACHER') {
        navigate('/teacher/dashboard');
      } else {
        setMessage('Login failed. Please contact support.');
      }
    } catch (err) {
      setMessage('Login failed. Please check your phone number and password.');
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h2>學生 & 教練</h2>
        <div>
          <label>電話: </label>
          <input
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </div><br />

        <div>
          <label>密碼: </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div><br />

        <button type="submit">
          登入
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default UserLogin
