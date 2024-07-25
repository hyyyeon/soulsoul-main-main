import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const DetailDiary = () => {
  const { id } = useParams(); // URL 파라미터에서 일기 ID 가져오기
  const [diary, setDiary] = useState(null);

  useEffect(() => {
    const fetchDiary = async () => {
      const token = localStorage.getItem('token'); // 저장된 JWT 토큰 가져오기
      try {
        const response = await fetch(`http://localhost:3011/get-diary/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}` // JWT 토큰을 Authorization 헤더에 포함
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setDiary(data.diary || {});
      } catch (error) {
        console.error('Error fetching diary:', error);
      }
    };

    fetchDiary();
  }, [id]);

  if (!diary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="display-4 mt-4 fw-bold">일기 상세</h1>
      <h2>{diary.title}</h2>
      <p>{diary.content}</p>
      <p><strong>날짜:</strong> {diary.date}</p>
      <Link to="/diary" className="btn btn-primary">돌아가기</Link>
    </div>
  );
};

export default DetailDiary;
