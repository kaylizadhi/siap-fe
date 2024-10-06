"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated, e.g., by checking for a session or token
    const isLoggedIn = checkAuth(); // Custom function to check if user is logged in

    if (!isLoggedIn) {
      // Redirect to login if user is not authenticated
      router.push('/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove the token
    router.push('/login');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to the Dashboard</h1>
      <button 
        onClick={handleLogout} 
        style={{
          backgroundColor: '#A62626',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Logout
      </button>
    </div>
  );
}

// Example function to check if a user is logged in
function checkAuth() {
    const token = localStorage.getItem('authToken');
    // Optionally: send this token to the backend to validate if the session is valid
    return token !== null;
}
