// src/app/list-klien/detail-klien/[id]/page.js
"use client";

import { useState, useEffect } from "react";

export default function KlienDetail({ params }) {
  const { id } = params; // Get the ID from the params
  const [klien, setKlien] = useState(null);
  const [formData, setFormData] = useState({
    nama_klien: "",
    nama_perusahaan: "",
    daerah: "",
    harga_survei: "",
  });

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/klien/${id}/`) // Update this to match your API endpoint
        .then((response) => response.json())
        .then((data) => {
          setKlien(data);
          setFormData(data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:8000/klien/${id}/update/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Data updated successfully!");
      // Optionally, redirect or update the UI
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:8000/klien/${id}/delete/`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Data deleted successfully!");
      // Optionally, redirect or update the UI
    }
  };

  if (!klien) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Detail Klien</h1>
      <form onSubmit={handleUpdate}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Nama Klien:
          </label>
          <input
            type="text"
            name="nama_klien"
            value={formData.nama_klien}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Nama Perusahaan:
          </label>
          <input
            type="text"
            name="nama_perusahaan"
            value={formData.nama_perusahaan}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Daerah:</label>
          <input
            type="text"
            name="daerah"
            value={formData.daerah}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Harga Survei:
          </label>
          <input
            type="number"
            name="harga_survei"
            value={formData.harga_survei}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
          />
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
          >
            Update
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}






// // src/app/list-klien/detail-klien/[id]/page.js
// "use client"

// import { useState, useEffect } from 'react';

// export default function KlienDetail({ params }) {
//   const { id } = params; // Get the ID from the params
//   const [klien, setKlien] = useState(null);
//   const [formData, setFormData] = useState({
//     nama_klien: '',
//     nama_perusahaan: '',
//     daerah: '',
//     harga_survei: '',
//   });

//   useEffect(() => {
//     if (id) {
//       fetch(`http://localhost:8000/klien/${id}/`) // Update this to match your API endpoint
//         .then(response => response.json())
//         .then(data => {
//           setKlien(data);
//           setFormData(data);
//         })
//         .catch(error => console.error('Error:', error));
//     }
//   }, [id]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     const response = await fetch(`http://localhost:8000/klien/${id}/update/`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(formData),
//     });

//     if (response.ok) {
//       // Handle successful update (e.g., redirect or show a message)
//     }
//   };

//   const handleDelete = async () => {
//     const response = await fetch(`http://localhost:8000/klien/${id}/delete/`, {
//       method: 'DELETE',
//     });

//     if (response.ok) {
//       // Handle successful deletion (e.g., redirect or show a message)
//     }
//   };

//   if (!klien) return <div>Loading...</div>;

//   return (
//     <div>
//       <h1>Detail Klien</h1>
//       <form onSubmit={handleUpdate}>
//         <label>Nama Klien:</label>
//         <input type="text" name="nama_klien" value={formData.nama_klien} onChange={handleChange} />
//         <label>Nama Perusahaan:</label>
//         <input type="text" name="nama_perusahaan" value={formData.nama_perusahaan} onChange={handleChange} />
//         <label>Daerah:</label>
//         <input type="text" name="daerah" value={formData.daerah} onChange={handleChange} />
//         <label>Harga Survei:</label>
//         <input type="number" name="harga_survei" value={formData.harga_survei} onChange={handleChange} />
//         <button type="submit">Update</button>
//       </form>
//       <button onClick={handleDelete}>Delete</button>
//     </div>
//   );
// }
