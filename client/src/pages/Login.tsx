import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // prevent default form submission
    
    // Store user object in localStorage with the key 'user'
    localStorage.setItem('user', JSON.stringify({ id: userId }));
    
    console.log('User ID saved:', userId);
    navigate("/upload");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userId">Username</label>
        <input
          type="text"
          name="userId"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}