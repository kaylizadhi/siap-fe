"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false); // State for login success
    const [showNotification, setShowNotification] = useState(false);
    const router = useRouter(); // Next.js router for navigation

    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberedUsername');
        const savedRememberMe = localStorage.getItem('rememberMe') === 'true'; // Retrieve the checkbox status
    
        if (savedRememberMe && savedUsername) {
          setUsername(savedUsername); // Prefill the saved username
          setRememberMe(true); // Set the checkbox to true
        }
      }, []);

    

    const handleLupaPassword = () => router.push('/forgot-password');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
  
      try {
        const res = await fetch('http://localhost:8000/api/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
  
        if (!res.ok) {
          const errorData = await res.json(); // Get error details
          setError(errorData.error);
          setShowNotification(true); // Show failure notification
          setTimeout(() => setShowNotification(false), 3000); // Hide after 3 seconds
          return;
        }
  
        const data = await res.json(); // Only read the body once if response is ok
        localStorage.setItem('authToken', data.token); // Store token locally

        if (rememberMe) {
            // Save the username and the checkbox status to localStorage
            localStorage.setItem('rememberedUsername', username);
            localStorage.setItem('rememberMe', 'true');
          } else {
            // Clear the saved username if "Ingat Saya" is not checked
            localStorage.removeItem('rememberedUsername');
            localStorage.removeItem('rememberMe');
          }
          setSuccess(true); // Show success notification
          setShowNotification(true);
          setTimeout(() => {
            setShowNotification(false); // Hide after 3 seconds
            router.push('/dashboard'); // Redirect to the dashboard after success
          }, 1000);
          
        } catch (error) {
          setError("An unexpected error occurred");
          setShowNotification(true); // Show error notification
          setTimeout(() => setShowNotification(false), 3000); // Hide after 3 seconds
        }
    };

  return (
    <div className="login-container">
      <div className="logo-header-container">
        <img src="/siap-logo.png" alt="SIAP Logo" className="logo" />
        <h1 className="system-title">
          Sistem Informasi Administrasi <br /> dan Pengendalian Mutu
        </h1>
      </div>

      <h2 className="login-heading">Login</h2>

      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Masukkan Username"
          required
        />

        <label>Password</label>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan Password"
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            <img
              src="/eye-icon.png"  
              alt="Show Password"
              className="eye-icon"
            />
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="remember-forgot">
          <label>
            <input 
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
             /> Ingat Saya
          </label>
          <a onClick={handleLupaPassword} style={{ cursor: 'pointer' }}>Lupa Password?</a>
        </div>

        <button type="submit" className="login-btn">Login</button>
      </form>

      {/* Notification Pop-up */}
      {showNotification && (
        <div className={`notification ${success ? 'success' : 'failure'}`}>
          {success ? (
            <div>
              <img src="/success-icon.png" alt="Success Icon" className="icon" />
              <p>Berhasil Login!</p>
              <button onClick={() => setShowNotification(false)}>OK</button>
            </div>
          ) : (
            <div>
              <img src="/error-icon.png" alt="Error Icon" className="icon" />
              <p>Username/Password Salah!</p>
              <button onClick={() => setShowNotification(false)}>Coba lagi</button>
            </div>
          )}
        </div>
      )}

      <div className="footer">
        @2024 optimasys | Contact optimasys.work@gmail.com
      </div>
    </div>
  );
}
