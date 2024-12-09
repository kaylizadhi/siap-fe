"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../styles/buat-akun.module.css";

export default function BuatAkun() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [security_question, setSecurityQuestion] = useState("");
  const [security_answer, setSecurityAnswer] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const names = name.split(" ");
    const firstName = names[0] || ""; // First part as firstName
    const lastName = names.slice(1).join(" ") || ""; // Remaining as lastName

    if (
      !username ||
      !name ||
      !email ||
      !role ||
      !security_question ||
      !security_answer ||
      !password
    ) {
      setError("Semua field harus diisi!");
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

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}buatAkun/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email,
            username: username,
            role: role,
            security_question: security_question,
            security_answer: security_answer,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        const responseData = await response.json();
        setError(responseData.error || "Gagal membuat akun. Coba lagi.");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        return;
      }

      setSuccess(true);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        router.push("/daftar-akun");
      }, 1000);
    } catch (error) {
      console.error(error);
      setError("Gagal membuat akun. Coba lagi.");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const handleCancel = () => {
    setUsername("");
    setName("");
    setEmail("");
    setSecurityQuestion("");
    setSecurityAnswer("");
    setPassword("");
    setRole("");
  };

  return (
    <div className={styles.buatakunBody}>
      <div className={styles.buatakunContainer}>
        <h2 className={styles.buatakunHeading}>Buat Akun</h2>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>Username*</label>
          <input
            className={styles.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan Username"
            required
          />
          <label className={styles.label}>Name*</label>
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan Nama"
            required
          />
          <label className={styles.label}>Email*</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan Email"
            required
          />
          <label className={styles.label}>Role*</label>
          <select
            className={styles.input}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="" disabled>
              Pilih Role*
            </option>
            <option value="Eksekutif">Eksekutif</option>
            <option value="Administrasi">Administrasi</option>
            <option value="Admin Sistem">Admin Sistem</option>
            <option value="Logistik">Logistik</option>
            <option value="Pengendali Mutu">Pengendali Mutu</option>
          </select>
          <label className={styles.label}>Security Question*</label>
          <select
            className={styles.input}
            value={security_question}
            onChange={(e) => setSecurityQuestion(e.target.value)}
            required
          >
            <option value="" disabled>
              Pilih Security Question
            </option>
            <option value="Apa warna kesukaan Anda?">
              Apa warna kesukaan Anda?
            </option>
            <option value="Apa makanan kesukaan Anda?">
              Apa makanan kesukaan Anda?
            </option>
            <option value="Dimana tempat Anda lahir?">
              Dimana tempat Anda lahir?
            </option>
            <option value="Apa olahraga kesukaan Anda?">
              Apa olahraga kesukaan Anda?
            </option>
            <option value="Siapa nama orang tua Anda?">
              Siapa nama orang tua Anda?
            </option>
          </select>
          <label className={styles.label}>Security Answer*</label>
          <input
            className={styles.input}
            type="text"
            value={security_answer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
            placeholder="Buat Jawaban dari Security Question"
            required
          />
          <label className={styles.label}>Password*</label>
          <div className={styles.passwordContainer}>
            <input
              className={styles.input}
              type={showPassword ? "text" : "password"}
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
              <img src="/eye-icon.png" alt="Toggle Password Visibility" />
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.simpanBtn}>
            Simpan
          </button>
          <button
            type="button"
            className={styles.batalBtn}
            onClick={handleCancel}
          >
            Batal
          </button>
        </form>
        {showNotification && (
          <div
            className={`${styles.notification} ${
              success ? styles.success : styles.failure
            }`}
          >
            {success ? (
              <div>
                <img src="/success-icon.png" alt="Success Icon" />
                <p>Berhasil Membuat Akun!</p>
                <button onClick={() => setShowNotification(false)}>OK</button>
              </div>
            ) : (
              <div>
                <img src="/error-icon.png" alt="Error Icon" />
                <p>{error}</p>
                <button onClick={() => setShowNotification(false)}>
                  Coba lagi
                </button>
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