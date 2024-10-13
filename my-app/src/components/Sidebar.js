// components/Sidebar.js
"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../styles/Sidebar.module.css"; // Correct the path to the CSS module
import SidebarButtons from "./SidebarButtons";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(isOpen);
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.close : ""} border`}>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/">
              <SidebarButtons
                buttonText="Dashboard"
                svgIcon={
                  <svg
                    className="w-4 h-4 text-black"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l7 7h-4v7h-6V9H5l7-7z" />
                  </svg>
                }
                isActive={false} // Home is active
              />
            </Link>
          </li>
          <li>
            <SidebarButtons
              buttonText="Ubah Profil"
              svgIcon={
                <svg
                  className="w-4 h-4 text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l7 7h-4v7h-6V9H5l7-7z" />
                </svg>
              }
              isActive={false} // Home is active
            />
          </li>
          <li>
            <SidebarButtons
              buttonText="Buat Akun"
              svgIcon={
                <svg
                  className="w-4 h-4 text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l7 7h-4v7h-6V9H5l7-7z" />
                </svg>
              }
              isActive={false} // Home is active
            />
          </li>
          <li>
            <SidebarButtons
              buttonText="Buat Dokumen"
              svgIcon={
                <svg
                  className="w-4 h-4 text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l7 7h-4v7h-6V9H5l7-7z" />
                </svg>
              }
              isActive={false} // Home is active
            />
          </li>
          <li>
            <SidebarButtons
              buttonText="Daftar Dokumen"
              svgIcon={
                <svg
                  className="w-4 h-4 text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l7 7h-4v7h-6V9H5l7-7z" />
                </svg>
              }
              isActive={false} // Home is active
            />
          </li>
          <li>
            <SidebarButtons
              buttonText="Tracker Souvenir"
              svgIcon={
                <svg
                  className="w-4 h-4 text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l7 7h-4v7h-6V9H5l7-7z" />
                </svg>
              }
              isActive={false} // Home is active
            />
          </li>
          <li>
            <SidebarButtons
              buttonText="Tracker Status Survei"
              svgIcon={
                <svg
                  className="w-4 h-4 text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l7 7h-4v7h-6V9H5l7-7z" />
                </svg>
              }
              isActive={false} // Home is active
            />
          </li>
          <li>
            <Link href="/list-klien">
              <SidebarButtons
                buttonText="Daftar Klien"
                svgIcon={
                  <svg
                    className="w-4 h-4 text-black"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l7 7h-4v7h-6V9H5l7-7z" />
                  </svg>
                }
                isActive={false} // Home is active
              />
            </Link>
          </li>
          <li>
            <SidebarButtons
              buttonText="Daftar Survei"
              svgIcon={
                <svg
                  className="w-4 h-4 text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l7 7h-4v7h-6V9H5l7-7z" />
                </svg>
              }
              isActive={false} // Home is active
            />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
