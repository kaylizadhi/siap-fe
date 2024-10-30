"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/buat-akun.module.css';

export default function BuatAkun() {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(''); // New state for role
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation checks
        if (!username || !name || !email || !role || !password) {
            setError("Seluruh field tidak boleh kosong!");
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
            return;
        }

        if (!/\d/.test(password)) {
            setError("Password harus mengandung angka!");
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
            return;
        }

        // Simulate account creation success notification
        setSuccess(true);
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
            router.push('/dashboard');
        }, 1000);
    };

    return (
        <div className={styles.loginBody}>
            <div className={styles.loginContainer}>
                <div className={styles.logoHeaderContainer}>
                    <img src="/siap-logo.png" alt="SIAP Logo" className={styles.logo} />
                    <h1 className={styles.systemTitle}>
                        Sistem Informasi Administrasi <br /> dan Pengendalian Mutu
                    </h1>
                </div>

                <h2 className={styles.loginHeading}>Buat Akun</h2>

                <form onSubmit={handleSubmit}>
                    <label className={styles.label}>Username</label>
                    <input
                        className={styles.input}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Masukkan Username"
                        required
                    />
                    <label className={styles.label}>Name</label>
                    <input
                        className={styles.input}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masukkan Nama"
                        required
                    />
                    <label className={styles.label}>Email</label>
                    <input
                        className={styles.input}
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan Email"
                        required
                    />

                    <label className={styles.label}>Role</label>
                    <select
                        className={styles.input}
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Role</option>
                        <option value="Eksekutif">Eksekutif</option>
                        <option value="Administrasi">Administrasi</option>
                        <option value="Admin Sistem">Admin Sistem</option>
                        <option value="Logistik">Logistik</option>
                        <option value="Pengendali Mutu">Pengendali Mutu</option>
                    </select>

                    <label className={styles.label}>Password</label>
                    <div className={styles.passwordContainer}>
                        <input
                            className={styles.input}
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan Password"
                            required
                        />
                        <button
                            type="button"
                            className={styles.togglePassword}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <img src="/eye-icon.png" alt="Show Password" className="eye-icon" />
                        </button>
                    </div>

                    {error && <p className="error">{error}</p>}

                    <button type="submit" className={styles.BuatAkunBtn}>Simpan</button>
                </form>

                {showNotification && (
                    <div className={`${styles.notification} ${success ? styles.success : styles.failure}`}>
                        {success ? (
                            <div>
                                <img src="/success-icon.png" alt="Success Icon" className={styles.icon} />
                                <p>Berhasil Membuat Akun!</p>
                                <button onClick={() => setShowNotification(false)}>OK</button>
                            </div>
                        ) : (
                            <div>
                                <img src="/error-icon.png" alt="Error Icon" className={styles.icon} />
                                <p>{error}</p>
                                <button onClick={() => setShowNotification(false)}>Coba lagi</button>
                            </div>
                        )}
                    </div>
                )}

                <div className={styles.footer}>
                    @2024 optimasys | Contact optimasys.work@gmail.com
                </div>
            </div>
        </div>
    );
}
