import React, { useState } from 'react';
import { useLogin } from '../context/LoginContext'; // LoginContext에서 훅을 가져옵니다.
import { useNavigate, Link } from 'react-router-dom'; // Link를 추가했습니다.

const Login = () => {
  const [credentials, setCredentials] = useState({ user_id: '', password: '' });
  const { login } = useLogin(); // useLogin 훅을 사용하여 로그인 상태와 함수 가져오기
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 로그인 요청 예시
    try {
      const response = await fetch('http://localhost:3011/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      
      if (data.token) {
        login(data.user, data.token); // 로그인 성공 시 상태 업데이트
        navigate('/calendar'); // 성공 시 이동
      } else {
        alert('로그인 실패: ' + data.message);
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="page">
      <div className="title">LOGIN</div>
      <form className="content" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          name="user_id"
          placeholder="ID"
          value={credentials.user_id}
          onChange={handleChange}
        />
        <input
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
        />
        <button
          className={`login-button ${credentials.user_id && credentials.password ? 'enabled' : ''}`}
          disabled={!credentials.user_id || !credentials.password}
          type="submit"
        >
          로그인
        </button>
      </form>
      <div className="actions">
        <Link to="/signup" className="signup-link">회원가입</Link>
      </div>
    </div>
  );
};

export default Login;
