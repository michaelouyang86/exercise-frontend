import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { getExerciseApiClient } from '@/api/exerciseApiClient';

function UserLogin() {
  const navigate = useNavigate();
  const exerciseApiClient = getExerciseApiClient();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage('登入中...');
    
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

      <div>
        <br />測試帳號<br /><br />
        教練:
        <button 
          type="button" 
          onClick={() => {
            setPhone('0911111111');
            setPassword('111');
          }}
          style={{ marginLeft: '10px', marginRight: '12px' }}>
          帥哥教練
        </button>
        <button 
          type="button" 
          onClick={() => {
            setPhone('0922222222');
            setPassword('222');
          }}>
          美女教練
        </button><br /><br />

        學生:
        <button 
          type="button" 
          onClick={() => {
            setPhone('0933333333');
            setPassword('333');
          }}
          style={{ marginLeft: '10px', marginRight: '12px' }}>
          胖子學生
        </button>
        <button 
          type="button" 
          onClick={() => {
            setPhone('0944444444');
            setPassword('444');
          }}>
          瘦子學生
        </button>
      </div>
    </div>
  );
}

export default UserLogin
