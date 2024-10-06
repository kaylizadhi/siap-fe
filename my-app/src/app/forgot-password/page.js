"use client";

import { useState, useEffect } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  // Fetch CSRF token from Django backend
  const fetchCsrfToken = async () => {
    const res = await fetch('http://localhost:8000/csrf/', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    });
    const data = await res.json();
    setCsrfToken(data.csrfToken);
  };

  useEffect(() => {
    // Fetch CSRF token when the component mounts
    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('http://localhost:8000/password_reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // Include the CSRF token in the headers
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage('Password reset email sent! Check your inbox.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Enter your email address:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Send Password Reset Link</button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
