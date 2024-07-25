// API 코드 (api.js)
export const fetchUserInfo = async (token) => {
    const response = await fetch('http://localhost:3011/user-info', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
  
    const data = await response.json();
    return data.user;
  };
  
  export const changePassword = async (currentPassword, newPassword, token) => {
    const response = await fetch('http://localhost:3011/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });
  
    if (!response.ok) {
      throw new Error('Failed to change password');
    }
  
    return response.json();
  };
  