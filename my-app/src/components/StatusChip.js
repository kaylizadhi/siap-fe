// // StatusChip.jsx
// import React from "react";
// import styles from "../styles/StatusChip.module.css";

// const StatusChip = ({ text }) => {
//   const getStatusColor = (status) => {
//     const statusStyles = {
//       "Not Started": styles.statusChip_gray,
//       "In Progress": styles.statusChip_yellow,
//       Finished: styles.statusChip_green,
//       Delayed: styles.statusChip_red,
//     };

//     const matchingStyle = Object.keys(statusStyles).find((key) => status.includes(key));

//     return matchingStyle ? statusStyles[matchingStyle] : styles.statusChip_gray;
//   };

//   return <span className={`${styles.statusChip} ${getStatusColor(text)}`}>{text}</span>;
// };

// export default StatusChip;

// StatusChip.jsx
import React from "react";
import styles from "../styles/StatusChip.module.css";

const StatusChip = ({ text }) => {
  const getStatusColor = (status) => {
    const statusStyles = {
      "Not Started": styles.statusChip_gray,
      "In Progress": styles.statusChip_yellow,
      Finished: styles.statusChip_green,
      Delayed: styles.statusChip_red,
      Done: styles.statusChip_green,
    };

    const matchingStyle = Object.keys(statusStyles).find((key) => status.includes(key));

    return matchingStyle ? statusStyles[matchingStyle] : styles.statusChip_gray;
  };

  return <span className={`${styles.statusChip} ${getStatusColor(text)}`}>{text}</span>;
};

export default StatusChip;