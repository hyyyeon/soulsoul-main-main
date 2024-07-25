import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserInfo, changePassword } from './api/api'; // API 경로 맞추기

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || process.env.PUBLIC_URL + "/img/mypage.png");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user'));
  
      if (!token || !storedUser) {
        alert("로그인이 필요합니다.");
        window.location.href = "/Login";
        return;
      }
  
      try {
        const userInfo = await fetchUserInfo(token);
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo)); // 사용자 정보 로컬 저장
  
        // 로컬 스토리지에서 프로필 이미지 URL을 가져와 상태를 설정
        const storedImage = localStorage.getItem('profileImage');
        setProfileImage(storedImage || process.env.PUBLIC_URL + "/img/mypage.png");
      } catch (error) {
        console.error("유저 정보 요청 중 오류가 발생했습니다.", error);
        setError("유저 정보 요청 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
  
    getUserInfo();
    fetchImages();
  }, []);
  

  const fetchImages = async () => {
    try {
      const userId = 'your_user_id'; // 실제 사용자 ID로 교체
      const res = await fetch(`http://localhost:3011/get-images?user_id=${userId}`);
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      if (data.isSuccess) {
        setImages(data.images);
      } else {
        console.error('Error fetching images: ', data.message);
      }
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setProfileImage(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append('image', file);
    formData.append('user_id', user.user_id); // 실제 사용자 ID 사용
  
    try {
      const res = await fetch("http://localhost:3011/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.isSuccess) {
        alert('이미지 업로드 성공');
        setProfileImage(data.imageUrl); // 서버에서 받은 이미지 URL로 업데이트
        localStorage.setItem('profileImage', data.imageUrl); // 로컬 스토리지에도 저장
        setFile(null);
        fetchImages(); // 이미지 목록 새로 고침
      } else {
        alert('이미지 업로드 실패: ' + data.message);
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  const handleDelete = async (imageUrl) => {
    try {
      const res = await fetch("http://localhost:3011/delete-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: 'your_user_id', imageUrl }),
      });
      const data = await res.json();
      if (data.isSuccess) {
        alert('이미지 삭제 성공');
        fetchImages(); // 이미지 목록 새로 고침
      } else {
        alert('이미지 삭제 실패: ' + data.message);
      }
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profileImage"); // 로그아웃 시 프로필 이미지도 삭제
    window.location.href = "/Login";
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("모든 필드를 입력하세요.");
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const success = await changePassword(currentPassword, newPassword, token);
      if (success.isSuccess) {
        alert("비밀번호가 변경되었습니다.");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        alert("비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 변경 중 오류가 발생했습니다.", error);
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>로그인 후 다시 시도해 주세요.</div>;
  }

  return (
    <div className="mypage">
      <section className="sec">
        <div className="sec-box">
          <h1 className="sec-main">My Page</h1>
          <div className="sec-img" onClick={handleImageClick} style={{ cursor: "pointer" }}>
            <img
              src={profileImage}
              alt="mypage"
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <table>
            <tbody>
              <tr>
                <th className="name">이름</th>
                <td>{user.name || '정보 없음'}</td>
              </tr>
              <tr>
                <th className="name">아이디</th>
                <td>{user.user_id || '정보 없음'}</td>
              </tr>
              <tr>
                <th className="name">내 코인</th>
                <td>{user.coin || '정보 없음'}</td>
              </tr>
            </tbody>
          </table>
          <div className="password-change">
            <h3>비밀번호 변경</h3>
            <input
              className="input"
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              className="input"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className="Change-button" onClick={handleChangePassword}>Change Password</button>
            <span className="out" onClick={handleLogout}>Logout</span>
          </div>
          <h2 className="sec-wrap">
            <Link to="modify" style={{ textDecoration: "none" }}>
              수정
            </Link>
          </h2>
          <div className="image-upload">
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>이미지 업로드</button>
            <div className="images">
              {images.map((image) => (
                <div key={image.id} className="image-item">
                  <img src={image.image_url} alt="uploaded" />
                  <button onClick={() => handleDelete(image.image_url)}>삭제</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyPage;
