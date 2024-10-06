// components/SidebarButtons.js
import PropTypes from 'prop-types';
import { Caudex } from 'next/font/google'

const caudex = Caudex({ weight: '700', subsets: ['latin'] })

const SidebarButtons = ({ buttonText, svgIcon, isActive }) => {
  return (
    <button
      type="button"
      className={`px-3 py-3.5 w-full text-sm font-bold inline-flex items-center rounded-lg ${
        isActive
          ? 'bg-primary-100 text-primary-900 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-500' // Active styles
          : 'bg-white text-black hover:bg-primary-100 focus:ring-4 focus:outline-none focus:ring-primary-900 focus:bg-primary-100'  // Inactive styles
      } dark:bg-primary-500 dark:hover:bg-primary-500 dark:focus:ring-primary-500 ${caudex.className}`}
    >
      <span className="me-2">
        {svgIcon}
      </span>
      {buttonText}
    </button>
  );
};

// Prop validation
SidebarButtons.propTypes = {
  buttonText: PropTypes.string.isRequired,  // Ensure button text is passed and is a string
  svgIcon: PropTypes.element.isRequired,   // Ensure svgIcon is a valid React element (JSX)
  isActive: PropTypes.bool,                 // Ensure isActive is a boolean (true or false)
};

export default SidebarButtons;
