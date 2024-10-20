"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/forgot-password.module.css';

export default function ForgotPassword() {
  const router = useRouter();  // Import the router for navigation

  // State management
  const [username, setUsername] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);  // To track steps in the form
  const [error, setError] = useState('');

  // Fetch the security question for the username from the backend
  const handleGetSecurityQuestion = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/get-security-question/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),  // Ensure this is correct
      });
  
      const data = await res.json();
      if (res.ok) {
        setSecurityQuestion(data.security_question);  // Proceed to the next step
        setStep(2);
      } else {
        setError(data.error || 'User not found');
      }
    } catch (error) {
      setError('Unable to fetch security question');
    }
  };
  // Verify the answer and reset the password
  const handleVerifyAnswer = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/verify-security-answer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          security_answer: securityAnswer,
          new_password: newPassword
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Incorrect security answer');
        return;
      }

      alert('Password reset successful!');
      router.push('/login');  // Redirect to login after success
    } catch (err) {
      setError('Failed to reset password');
    }
  };

  return (
    <div className={styles.forgotPasswordBody}>
      <div className={styles.forgotPasswordContainer}>
        <h2 className={styles.heading}>Forgot Password</h2>

        {/* Step 1: Get Username */}
        {step === 1 && (
          <div>
            <h3>Username</h3>
            <input
              type="text"
              className={styles.Input}
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <button onClick={handleGetSecurityQuestion} className={styles.Button}>Get Security Question</button>
          </div>
        )}

        {/* Step 2: Answer Security Question and Reset Password */}
        {step === 2 && (
          <div>
            <h3>Answer Security Question</h3>
            <p>{securityQuestion}</p>
            <input
              type="text"
              className={styles.Input}
              placeholder="Masukkan jawaban"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
            <input
              type="password"
              className={styles.Input}
              placeholder="Masukkan password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button onClick={handleVerifyAnswer} className={styles.Button}>Reset Password</button>
          </div>
        )}

        {/* Error message display */}
        {error && <p className={styles.error}>{error}</p>}

        <footer className={styles.footer}>
          <p>@2024 optimasys | Contact optimasys.work@gmail.com</p>
        </footer>
      </div>
    </div>
  );
}
