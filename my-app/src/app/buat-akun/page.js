"use client"; // Pastikan ini ada di baris pertama

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 



export default function BuatAkun() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState(''); // Ini di-backend belum ada, bisa dihilangkan
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email,
      name,
      role,
      password,
    };

    try {
      const response = await fetch('/api/create-account/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Akun berhasil dibuat!");
        router.push('/');  // Redirect setelah sukses
      } else {
        const result = await response.json();
        alert(`Error: ${result.errors ? JSON.stringify(result.errors) : result.error}`);
      }
    } catch (error) {
      console.error('Error submitting form', error);
      alert('Terjadi kesalahan saat membuat akun.');
    }
  };

  return (
    <div className="container">
      <h1>Buat Akun</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Masukkan email"
          />
        </div>

        <div className="form-group">
          <label>Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Masukkan nama"
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Pilih Role</option>
            <option value="admin sistem">Admin Sistem</option>
            <option value="eksekutif">Eksekutif</option>
            <option value="administrasi">Administrasi</option>
            <option value="logistik">Logistik</option>
            <option value="pengendali mutu">Pengendali Mutu</option>
          </select>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Masukkan password"
          />
        </div>

        <button type="submit">Simpan</button>
      </form>
    </div>
  );
}
