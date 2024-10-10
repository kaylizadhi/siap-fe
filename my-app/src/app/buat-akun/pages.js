"use client"; // Pastikan ini ada di baris pertama

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Ganti next/router menjadi next/navigation

export default function BuatAkun() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (role !== 'admin-sistem') {
      alert('Hanya admin sistem yang bisa membuat akun.');
      return;
    }

    console.log({
      email,
      name,
      username,
      role,
      password,
    });

    alert("Akun berhasil dibuat!");

    router.push('/');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-md">
        <h1 className="text-3xl font-semibold text-red-600 mb-6">Buat Akun</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Masukkan email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Masukkan nama"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Masukkan username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Pilih Role</option>
              <option value="admin-sistem">Admin Sistem</option>
              <option value="eksekutif">Eksekutif</option>
              <option value="administrasi">Administrasi</option>
              <option value="logistik">Logistik</option>
              <option value="pengendali-mutu">Pengendali Mutu</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Masukkan password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-sm text-red-500 mt-2">
              Minimal terdiri dari 8 karakter dan merupakan kombinasi huruf, angka, dan simbol.
            </p>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button type="submit" className="bg-red-600 text-white py-2 px-4 rounded-md">
              Simpan
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="border border-red-600 text-red-600 py-2 px-4 rounded-md"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
