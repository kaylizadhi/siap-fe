"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../../styles/login.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedRememberMe && savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleLupaPassword = () => router.push("/forgot-password");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        toast.error("Username atau password salah");
        return;
      }

      const data = await res.json();
      localStorage.setItem("authToken", data.token);

      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberMe");
      }

      try {
        const roleRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}accounts/get_sidebar_role/`, {
          headers: { Authorization: `Token ${data.token}` },
        });

        const roleData = await roleRes.json();

        if (roleRes.ok) {
          toast.success("Berhasil Login!");
          setTimeout(() => {
            router.push(roleData.homepage);
          }, 1500);
        } else {
          throw new Error("Role verification failed");
        }
      } catch (error) {
        console.error("Failed to verify role:", error);
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Username atau password salah");
    }
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

        <h2 className={styles.loginHeading}>Login</h2>

        <form onSubmit={handleSubmit}>
          <label className={styles.label}>Username</label>
          <input className={styles.input} type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukkan Username" required />

          <label className={styles.label}>Password</label>
          <div className={styles.passwordContainer}>
            <input className={styles.input} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan Password" required />
            <button type="button" className={styles.togglePassword} onClick={() => setShowPassword(!showPassword)}>
              <img src="/eye-icon.png" alt="Show Password" className="eye-icon" />
            </button>
          </div>

          <div className={styles.rememberForgot}>
            <label className={styles.label}>
              <input className={styles.input} type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              Ingat Saya
            </label>
            <a onClick={handleLupaPassword} style={{ cursor: "pointer" }}>
              Lupa Password?
            </a>
          </div>

          <button type="submit" className={styles.loginBtn}>
            Login
          </button>
        </form>

        <div className={styles.footer}>@2024 optimasys | Contact optimasys.work@gmail.com</div>
      </div>
    </div>
  );
}
