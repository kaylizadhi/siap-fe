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

  // Dummy function to simulate fetching the security question for the username
  const handleGetSecurityQuestion = () => {
    // Dummy simulation - replace this with real API call later
    if (username === 'testuser') {
      setSecurityQuestion('What is your favorite color?');
      setStep(2);  // Proceed to next step
    } else {
      setError('User not found');
    }
  };

  // Dummy function to simulate verifying the security answer and resetting the password
  const handleVerifyAnswer = () => {
    // Dummy simulation - replace this with real API call later
    if (securityAnswer.toLowerCase() === 'blue') {
      alert('Password reset successful!');  // Simulate success

      // Redirect the user back to the login page
      router.push('/login');

      setStep(1);  // Reset back to step 1
      setUsername('');
      setSecurityQuestion('');
      setSecurityAnswer('');
      setNewPassword('');
      setError('');
    } else {
      setError('Incorrect answer');
    }
  };

  return (
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
  );
}
