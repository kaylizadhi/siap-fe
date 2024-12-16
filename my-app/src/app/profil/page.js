"use client";

import styles from "../../../styles/profil.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Profil() {
  const router = useRouter();
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [role, setRole] = useState("");

  const toggleEmailEditable = () => setIsEmailEditable(!isEmailEditable);
  const toggleNameEditable = () => setIsNameEditable(!isNameEditable);
  const toggleUsernameEditable = () => setIsUsernameEditable(!isUsernameEditable);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleNewPasswordVisibility = () => setIsNewPasswordVisible(!isNewPasswordVisible);

  // Function to disable all editable fields
  const disableAllFields = () => {
    setIsEmailEditable(false);
    setIsNameEditable(false);
    setIsUsernameEditable(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}profil/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setEmail(data.email);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setUsername(data.username);
        setFullName(`${data.first_name || ""} ${data.last_name || ""}`.trim());
        setRole(data.role);
      } catch (error) {
        toast.error("Gagal memuat data profil");
        setError("Unable to fetch user data");
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  const handleCancel = () => {
    disableAllFields();
    router.push("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const names = fullName.split(" ");
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "";

    const token = localStorage.getItem("authToken");

    try {
      // Update profile details
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}profil/`, {
        method: "PATCH",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          username: username,
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal mengupdate profil");
      }

      // If both passwords are provided, update the password
      if (oldPassword && newPassword) {
        const passwordRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}change-password/`, {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
          }),
        });

        if (!passwordRes.ok) {
          const passwordError = await passwordRes.json();
          throw new Error(passwordError.error || "Password lama tidak sesuai");
        }

        toast.success("Password berhasil diubah");
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.success("Profil berhasil diperbarui");
      }

      // Disable all editable fields after successful update
      disableAllFields();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.containerbackground}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Profil {firstName}</h1>
          <h2 className={styles.roleHeader}>{role}</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Email field */}
            <div className={styles.fieldGroup}>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEmailEditable} className={isEmailEditable ? "" : styles.disabledInput} />
              <span className={styles.icon} onClick={toggleEmailEditable}>
                <img src="/images/Edit.svg" alt="Edit" />
              </span>
            </div>

            {/* Name field */}
            <div className={styles.fieldGroup}>
              <label>Nama</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={!isNameEditable} className={isNameEditable ? "" : styles.disabledInput} />
              <span className={styles.icon} onClick={toggleNameEditable}>
                <img src="/images/Edit.svg" alt="Edit" />
              </span>
            </div>

            {/* Username field */}
            <div className={styles.fieldGroup}>
              <label>Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} disabled={!isUsernameEditable} className={isUsernameEditable ? "" : styles.disabledInput} />
              <span className={styles.icon} onClick={toggleUsernameEditable}>
                <img src="/images/Edit.svg" alt="Edit" />
              </span>
            </div>

            {/* Password fields */}
            <div className={styles.passwordFields}>
              <div className={styles.fieldGroup}>
                <label>Password Lama</label>
                <input type={isPasswordVisible ? "text" : "password"} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="********" />
                <span className={styles.icon} onClick={togglePasswordVisibility}>
                  <img src="/images/eye-icon.png" alt="Toggle Password Visibility" />
                </span>
              </div>
              <div className={styles.fieldGroup}>
                <label>Password Baru</label>
                <input type={isNewPasswordVisible ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="********" />
                <span className={styles.icon} onClick={toggleNewPasswordVisibility}>
                  <img src="/images/eye-icon.png" alt="Toggle New Password Visibility" />
                </span>
              </div>
            </div>

            {/* Save and Cancel buttons */}
            <div className={styles.buttons}>
              <button type="submit" className={styles.saveButton}>
                Simpan
              </button>
              <button type="button" className={styles.cancelButton} onClick={handleCancel}>
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className={styles.footer}>@2024 optimasys | Contact optimasys.work@gmail.com</div>
    </div>
  );
}
