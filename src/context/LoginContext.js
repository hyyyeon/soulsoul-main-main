import React, { createContext, useContext, useState, useEffect } from 'react';

// 로그인 컨텍스트 생성
const LoginContext = createContext();

// 로그인 컨텍스트를 제공하는 컴포넌트
export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // useEffect를 사용하여 로컬 저장소에서 사용자 정보 로드
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 로그인 함수
  const login = (userInfo, token) => {
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    localStorage.setItem('token', token);
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <LoginContext.Provider value={{ user, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

// useLogin 훅을 통해 로그인 정보를 가져오기
export const useLogin = () => {
  return useContext(LoginContext);
};
