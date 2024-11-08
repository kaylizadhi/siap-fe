// components/Sidebar.js
"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../styles/Sidebar.module.css"; // Correct the path to the CSS module
import SidebarButtons from "./SidebarButtons";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the token
    router.push("/login");
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.close : ""} border`}>
      <div className={styles.logoContainer}>
        <Image
          src="/images/siap-logo-2.svg"
          alt="SIAP Logo"
          width={200}
          height={80}
          priority
        />
      </div>
      <nav className={styles.nav}>
        <div className={styles.menuContainer}>
          <ul>
            <li className={`${styles.menuItem} ${styles.highlightedItem}`}>
              <Link href="/dashboard">
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
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 21.5852H7.5V13.5852H16.5V21.5852H21V9.58517L12 3.58516L3 9.58517V21.5852ZM0 24.2518V8.25183L12 0.251831L24 8.25183V24.2518H13.5V16.2518H10.5V24.2518H0Z"
                          fill="#1C1C1C"
                        />
                      </svg>
                    </svg>
                  }
                  route="/dashboard"
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
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 22.2518C1 20.6605 1.63214 19.1344 2.75736 18.0092C3.88258 16.884 5.4087 16.2518 7 16.2518H19C20.5913 16.2518 22.1174 16.884 23.2426 18.0092C24.3679 19.1344 25 20.6605 25 22.2518C25 23.0475 24.6839 23.8105 24.1213 24.3732C23.5587 24.9358 22.7956 25.2518 22 25.2518H4C3.20435 25.2518 2.44129 24.9358 1.87868 24.3732C1.31607 23.8105 1 23.0475 1 22.2518Z"
                        stroke="#1C1C1C"
                        stroke-width="2"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M13 10.2518C15.4853 10.2518 17.5 8.23711 17.5 5.75183C17.5 3.26655 15.4853 1.25183 13 1.25183C10.5147 1.25183 8.5 3.26655 8.5 5.75183C8.5 8.23711 10.5147 10.2518 13 10.2518Z"
                        stroke="#1C1C1C"
                        stroke-width="2"
                      />
                    </svg>
                  </svg>
                }
                route="/anjay"
              />
            </li>
            <li>
              <Link href="/buat-akun">
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
                      <path
                        d="M24 13.9661H13.7143V24.2518H10.2857V13.9661H0V10.5375H10.2857V0.251831H13.7143V10.5375H24V13.9661Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                  }
                  route="/buat-akun"
                />
              </Link>
            </li>
            <li>
              <Link href="/generator-dokumen/proposal">
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
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_243_369)">
                          <path
                            d="M12.3217 1.07355H4.10743C3.67172 1.07355 3.25385 1.24663 2.94576 1.55473C2.63766 1.86282 2.46457 2.28069 2.46457 2.7164V17.5021L0.821716 22.4307L7.39315 20.7878H20.536C20.9717 20.7878 21.3896 20.6147 21.6977 20.3067C22.0058 19.9986 22.1789 19.5807 22.1789 19.145V10.9307"
                            stroke="#1C1C1C"
                            stroke-width="1.64286"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M13.7391 13.6194L8.81049 14.5066L9.63191 9.51226L17.4026 1.77441C17.5554 1.62042 17.7371 1.4982 17.9373 1.4148C18.1375 1.33139 18.3522 1.28845 18.5691 1.28845C18.7859 1.28845 19.0007 1.33139 19.2009 1.4148C19.4011 1.4982 19.5828 1.62042 19.7355 1.77441L21.4769 3.51584C21.6309 3.66856 21.7531 3.85026 21.8365 4.05046C21.9199 4.25066 21.9629 4.46539 21.9629 4.68226C21.9629 4.89914 21.9199 5.11387 21.8365 5.31407C21.7531 5.51427 21.6309 5.69597 21.4769 5.84869L13.7391 13.6194Z"
                            stroke="#1C1C1C"
                            stroke-width="1.64286"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_243_369">
                            <rect
                              width="23"
                              height="23"
                              fill="white"
                              transform="translate(0 0.251831)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </svg>
                  }
                  route="/generator-dokumen"
                />
              </Link>
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
                    <path
                      d="M21.7 6.50897L14.7 0.508974C14.5 0.337545 14.3 0.251831 14 0.251831H4C2.9 0.251831 2 1.02326 2 1.96612V22.5375C2 23.4804 2.9 24.2518 4 24.2518H20C21.1 24.2518 22 23.4804 22 22.5375V7.10897C22 6.85183 21.9 6.6804 21.7 6.50897ZM14 2.30897L19.6 7.10897H14V2.30897ZM20 22.5375H4V1.96612H12V7.10897C12 8.05183 12.9 8.82326 14 8.82326H20V22.5375Z"
                      fill="#1C1C1C"
                    />
                    <path
                      d="M7 16.3768H14.5V18.2518H7V16.3768ZM7 10.7518H14.5V12.6268H7V10.7518Z"
                      fill="#1C1C1C"
                    />
                  </svg>
                }
                route="/anjay"
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
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.8 10.2518V21.0518M20.8 21.0518V25.2518H5.2V21.0518M20.8 21.0518H25V6.05183L22 3.05183L17.8 1.25183H8.2L4 3.05183L1 6.05183V21.0518H5.2M5.2 21.0518V10.2518"
                        stroke="#1C1C1C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M13.0001 11.4519V25.2519"
                        stroke="#1C1C1C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4.00006 3.05176L13.0001 11.4518"
                        stroke="#1C1C1C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.20013 1.25183L13.0001 11.4518"
                        stroke="#1C1C1C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M17.8001 1.25183L13.0001 11.4518"
                        stroke="#1C1C1C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M22.0001 3.05176L13.0001 11.4518"
                        stroke="#1C1C1C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </svg>
                }
                route="/anjay"
              />
            </li>
            <li>
              <Link href="/tracker-survei">
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
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 6.25183V2.25183M14 26.2518V23.5852M23.3333 14.2518H26M2 14.2518H6M21.5427 6.70916L22.4853 5.7665M5.51467 22.7372L7.4 20.8518M20.6 20.8518L22.4853 22.7372M5.51467 5.7665L8.34267 8.5945"
                          stroke="#1C1C1C"
                          stroke-width="3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </svg>
                  }
                  route="/tracker-survei"
                />
              </Link>
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
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M24.9231 4.40568H19.7308V3.36722C19.7308 2.54096 19.4025 1.74855 18.8183 1.16431C18.234 0.580058 17.4416 0.251831 16.6154 0.251831H10.3846C9.55836 0.251831 8.76595 0.580058 8.18171 1.16431C7.59746 1.74855 7.26923 2.54096 7.26923 3.36722V4.40568H2.07692C1.52609 4.40568 0.997815 4.6245 0.608317 5.01399C0.218818 5.40349 0 5.93177 0 6.4826V23.098C0 23.6488 0.218818 24.1771 0.608317 24.5666C0.997815 24.9561 1.52609 25.1749 2.07692 25.1749H24.9231C25.4739 25.1749 26.0022 24.9561 26.3917 24.5666C26.7812 24.1771 27 23.6488 27 23.098V6.4826C27 5.93177 26.7812 5.40349 26.3917 5.01399C26.0022 4.6245 25.4739 4.40568 24.9231 4.40568ZM9.34615 3.36722C9.34615 3.0918 9.45556 2.82766 9.65031 2.63291C9.84506 2.43816 10.1092 2.32875 10.3846 2.32875H16.6154C16.8908 2.32875 17.1549 2.43816 17.3497 2.63291C17.5444 2.82766 17.6538 3.0918 17.6538 3.36722V4.40568H9.34615V3.36722ZM17.6538 6.4826V23.098H9.34615V6.4826H17.6538ZM2.07692 6.4826H7.26923V23.098H2.07692V6.4826ZM24.9231 23.098H19.7308V6.4826H24.9231V23.098Z"
                          fill="#1C1C1C"
                        />
                      </svg>
                    </svg>
                  }
                  route="/list-klien"
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
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M24 11.9171C23.9985 10.5031 23.4362 9.14741 22.4363 8.14753C21.4364 7.14766 20.0807 6.58528 18.6667 6.58381H14.2444C13.9211 6.56492 8.28667 6.16826 2.92111 1.66826C2.66201 1.45065 2.34618 1.3115 2.01074 1.26716C1.6753 1.22282 1.33417 1.27513 1.02742 1.41794C0.72068 1.56076 0.461061 1.78814 0.279065 2.07339C0.0970702 2.35864 0.000257482 2.6899 0 3.02826V20.806C4.60991e-05 21.1445 0.0967056 21.4759 0.278618 21.7613C0.46053 22.0467 0.720136 22.2743 1.02692 22.4172C1.33371 22.5602 1.67492 22.6126 2.01047 22.5683C2.34601 22.524 2.66194 22.3848 2.92111 22.1671C7.11778 18.6471 11.4767 17.6383 13.3333 17.356V20.8805C13.333 21.1734 13.405 21.4619 13.543 21.7203C13.681 21.9787 13.8808 22.199 14.1244 22.3616L15.3467 23.176C15.5829 23.3337 15.8535 23.4325 16.1357 23.4641C16.418 23.4957 16.7037 23.4592 16.969 23.3577C17.2343 23.2562 17.4713 23.0926 17.6604 22.8806C17.8494 22.6687 17.9849 22.4145 18.0556 22.1394L19.3633 17.2105C20.6464 17.0398 21.8238 16.409 22.6766 15.4353C23.5295 14.4617 23.9997 13.2115 24 11.9171ZM1.77778 20.7983V3.02826C6.53444 7.01826 11.4033 8.02826 13.3333 8.27715V15.5527C11.4056 15.806 6.53778 16.8138 1.77778 20.7983ZM16.3333 21.6871V21.6994L15.1111 20.8849V17.2505H17.5111L16.3333 21.6871ZM18.6667 15.4727H15.1111V8.36159H18.6667C19.6097 8.36159 20.514 8.73619 21.1808 9.40299C21.8476 10.0698 22.2222 10.9742 22.2222 11.9171C22.2222 12.8601 21.8476 13.7645 21.1808 14.4313C20.514 15.0981 19.6097 15.4727 18.6667 15.4727Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                  </svg>
                }
                route="/anjay"
              />
            </li>
          </ul>
          <div className={styles.logoutContainer}>
            <div onClick={handleLogout}>
              <SidebarButtons
                buttonText="Logout"
                svgIcon={
                  <svg
                    className="w-4 h-4 text-black"
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17 7.25195L15.59 8.66195L18.17 11.252H8V13.252H18.17L15.59 15.832L17 17.252L22 12.252M4 5.25195H12V3.25195H4C2.9 3.25195 2 4.15195 2 5.25195V19.252C2 20.352 2.9 21.252 4 21.252H12V19.252H4V5.25195Z"
                      fill="#1C1C1C"
                    />
                  </svg>
                }
                route="/login"
              />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
