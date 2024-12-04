import PropTypes from "prop-types";
import { Caudex } from "next/font/google";
import { usePathname } from "next/navigation";
import { cloneElement } from "react";

const caudex = Caudex({ weight: "700", subsets: ["latin"] });

const SidebarButtons = ({ buttonText, svgIcon, route }) => {
  const pathname = usePathname();
  const isActive =
    (pathname.startsWith(route) && route !== "/") ||
    (pathname === "/" && route === "/");

  // Clone and modify the SVG to add the hover and active colors
  const modifiedSvgIcon = cloneElement(svgIcon, {
    className: `w-4 h-4 group-hover:text-[#A52524] ${
      isActive ? "text-[#A52524]" : "text-black"
    }`,
  });

  return (
    <button
      type="button"
      className={`group px-3 py-3 w-full text-sm font-bold inline-flex items-center rounded-lg 
        ${
          isActive
            ? "bg-primary-100 text-primary-900 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-500"
            : "bg-white text-black hover:bg-primary-100 hover:text-primary-900 focus:ring-4 focus:outline-none focus:ring-primary-900 focus:bg-primary-100"
        } ${caudex.className}`}
    >
      <span className="me-2">{modifiedSvgIcon}</span>
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
