// components/SidebarButtons.js
import PropTypes from "prop-types";
import { Caudex } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

const SidebarButtons = ({ buttonText, svgIcon, route }) => {
  const pathname = usePathname();
  const isActive =
    (pathname.startsWith(route) && route !== "/") ||
    (pathname === "/" && route === "/");

  return (
    <button
      type="button"
      className={`px-3 py-3.5 w-full text-sm font-bold inline-flex items-center rounded-lg ${
        isActive
          ? "bg-primary-100 text-primary-900 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-500" // Active styles
          : "bg-white text-black hover:bg-primary-100 focus:ring-4 focus:outline-none focus:ring-primary-900 focus:bg-primary-100" // Inactive styles
      }   ${caudex.className}`}
    >
      <span className="me-2">{svgIcon}</span>
      {buttonText}
    </button>
  );
};

SidebarButtons.propTypes = {
  buttonText: PropTypes.string.isRequired,
  svgIcon: PropTypes.element.isRequired,
  route: PropTypes.string.isRequired,
};

export default SidebarButtons;
