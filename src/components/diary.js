import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Diary = () => {
  const [diaries, setDiaries] = useState([]);
  const user_id = localStorage.getItem('user_id'); // 저장된 사용자 ID 가져오기

  const fetchDiaries = useCallback(async () => {
    const token = localStorage.getItem('token'); // 저장된 JWT 토큰 가져오기
    try {
      const response = await fetch(`http://localhost:3011/get-diaries?user_id=${user_id}`, {
        headers: {
          'Authorization': `Bearer ${token}` // JWT 토큰을 Authorization 헤더에 포함
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDiaries(data.diaries || []);
    } catch (error) {
      console.error('Error fetching diaries:', error);
    }
  }, [user_id]);

  useEffect(() => {
    fetchDiaries();
  }, [fetchDiaries]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token'); // 저장된 JWT 토큰 가져오기
    try {
      const response = await fetch(`http://localhost:3011/delete-diary/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // JWT 토큰을 Authorization 헤더에 포함
        }
      });

      if (response.ok) { // 요청이 성공적일 경우
        setDiaries(diaries.filter((diary) => diary.id !== id));
      } else {
        // 서버 응답이 성공적이지 않은 경우
        console.error('Failed to delete the diary:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting diary:', error);
    }
  };

  return (
    <div>
      <br />
      <div className="container mt-5 text-center">
        <h1 className="display-4 mt-4 fw-bold">
          <i className="bi bi-book"></i>
          오늘의<span className="spantag"> 일기</span>
        </h1>
        <br />
        <br />
        <div className="d-grid gap-2">
          <Link
            to="/add-diary"
            className="text-white fw-bold text-decoration-none btn mb-2"
          >
            글쓰기
          </Link>
        </div>
        <table className="table table-striped mt-4 mb-5">
          <thead className="custom-thead">
            <tr>
              <th className="text-center">제목</th>
              <th className="text-center">날짜</th>
              <th className="text-center">삭제</th>
            </tr>
          </thead>
          <tbody>
            {diaries.map((diary) => (
              <tr key={diary.id}>
                <td className="text-center">
                  <Link
                    to={`/detaildiary/${diary.id}`}
                    className="text-decoration-none"
                  >
                    {diary.title}
                  </Link>
                </td>
                <td className="text-center">{diary.date}</td>
                <td className="text-center">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(diary.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Diary;
