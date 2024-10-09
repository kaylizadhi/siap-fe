"use client";

import styles from '../../../styles/profil.module.css';  // Import CSS styles

import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Profil() {
    const router = useRouter();
    const [isEmailEditable, setIsEmailEditable] = useState(false);
    const [isNameEditable, setIsNameEditable] = useState(false);
    const [isUsernameEditable, setIsUsernameEditable] = useState(false);
    const [email, setEmail] = useState("janedoe@gmail.com");
    const [name, setName] = useState("Jane Doe");
    const [username, setUsername] = useState("janedoe");
    const toggleEmailEditable = () => setIsEmailEditable(!isEmailEditable);
    const toggleNameEditable = () => setIsNameEditable(!isNameEditable);
    const toggleUsernameEditable = () => setIsUsernameEditable(!isUsernameEditable);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
    const toggleNewPasswordVisibility = () => setIsNewPasswordVisible(!isNewPasswordVisible);

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

  function checkAuth() {
    const token = localStorage.getItem('authToken');
    return token !== null;
  }

  const handleCancel = () => router.push('/dashboard');


  return (
    <div className={styles.containerbackground}>
        <div className ={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                <img src="/images/siap-logo-2.svg" alt="siap-logo-2" />
                </div>
                <nav className={styles.nav}>
                <a href="/dashboard">
                    <img src="/images/Home.svg" alt="Dashboard Icon" className={styles.icon}/>Dashboard</a>
                <a href="/profil" className={styles.active}>
                    <img src="/images/Profile.svg" alt="Profile Icon" className={styles.active}/>Profil</a>
                <a href="/create-account">
                    <img src="/images/Add.svg" alt="Create Icon" className={styles.icon}/>Buat Akun</a>
                <a href="/buat-documents">
                    <img src="/images/Create.svg" alt="Buat Dokumen Icon" className={styles.icon}/>Buat Dokumen</a>
                <a href="/documents">
                    <img src="/images/Document.svg" alt="Daftar Dokumen Icon" className={styles.icon}/>Daftar Dokumen</a>
                <a href="/souvenir-tracker">
                    <img src="/images/Inventory.svg" alt="Tracker Souvenir Icon" className={styles.icon}/>Tracker Souvenir</a>
                <a href="/survey-tracker">
                    <img src="/images/Status.svg" alt="Tracker Status Icon" className={styles.icon}/>Tracker Status Survei</a>
                <a href="/clients">
                    <img src="/images/Client.svg" alt="Daftar Klien Icon" className={styles.icon}/>Daftar Klien</a>
                <a href="/surveys">
                    <img src="/images/Survey.svg" alt="Daftar Survey Icon" className={styles.icon}/>Daftar Survei</a>
                </nav>
                <a href="/login" onClick={handleLogout} className={styles.logout}>
                    <img src="/images/Out.svg" alt="Logout Icon" className={styles.icon}/>Logout</a>
            </aside>

            <main className={styles.main}>
                <h1 className={styles.title}>Profil</h1>
                <form className={styles.form}>
          
                    {/* Email field */}
                    <div className={styles.fieldGroup}>
                        <label>Email</label>
                        <input 
                        type="email" 
                        value={email}  // Controlled input with state
                        onChange={(e) => setEmail(e.target.value)}  // Update state on change
                        disabled={!isEmailEditable}  // Disable if not editable
                        className={isEmailEditable ? '' : styles.disabledInput}  // Apply styles
                        />
                        <span className={styles.icon} onClick={toggleEmailEditable}>
                        <img src="/images/Edit.svg" alt="Edit" />
                        </span>
                    </div>

                    {/* Name field */}
                    <div className={styles.fieldGroup}>
                        <label>Nama</label>
                        <input 
                        type="text" 
                        value={name}  // Controlled input with state
                        onChange={(e) => setName(e.target.value)}  // Update state on change
                        disabled={!isNameEditable}  // Disable if not editable
                        className={isNameEditable ? '' : styles.disabledInput}
                        />
                        <span className={styles.icon} onClick={toggleNameEditable}>
                        <img src="/images/Edit.svg" alt="Edit" />
                        </span>
                    </div>

                    {/* Username field */}
                    <div className={styles.fieldGroup}>
                        <label>Username</label>
                        <input 
                            type="text" 
                            value={username}  // Controlled input with state
                            onChange={(e) => setUsername(e.target.value)}  // Update state on change
                            disabled={!isUsernameEditable}  // Disable if not editable
                            className={isUsernameEditable ? '' : styles.disabledInput}
                        />
                        <span className={styles.icon} onClick={toggleUsernameEditable}>
                        <img src="/images/Edit.svg" alt="Edit" />
                        </span>
                    </div>

                    {/* Password fields */}
                    <div className={styles.passwordFields}>
                        <div className={styles.fieldGroup}>
                            <label>Password Lama</label>
                            <input type="password" placeholder="********" />
                            </div>
                            <div className={styles.fieldGroup}>
                            <label>Password Baru</label>
                            <input 
                                type={isNewPasswordVisible ? "text" : "password"}  // Toggle between password and text
                                placeholder="********" 
                            />
                            <span className={styles.icon} onClick={toggleNewPasswordVisibility}>
                                <img src="/images/eye-icon.png" alt="Toggle New Password Visibility" />
                            </span>
                        </div>
                    </div>

                    {/* Save and Cancel buttons */}
                    <div className={styles.buttons}>
                        <button type="submit" className={styles.saveButton}>Simpan</button>
                        <button type="button" className={styles.cancelButton} onClick={handleCancel}>Batal</button>
                    </div>
                </form>
            </main>
        </div>
        <div className="footer">
        @2024 optimasys | Contact optimasys.work@gmail.com
      </div>
    </div>
  );
}
