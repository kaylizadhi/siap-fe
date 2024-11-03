import React from "react";
import { toast } from "react-toastify";

const StatusBox = ({
  label,
  status,
  onStatusChange,
  fieldKey,
  isLoading,
  isEditable,
  className = "",
}) => {
  const statusColors = {
    NOT_STARTED: "bg-gray-200",
    IN_PROGRESS: "bg-yellow-200",
    FINISHED: "bg-green-200",
    DELAYED: "bg-red-200",
  };

  const statusLabels = {
    NOT_STARTED: "Not Started",
    IN_PROGRESS: "In Progress",
    FINISHED: "Finished",
    DELAYED: "Delayed",
  };

  const handleChange = (e) => {
    const newStatus = e.target.value;
    if (isEditable) {
      onStatusChange(fieldKey, newStatus);
    } else {
      toast.error("You don't have permission to update this status");
    }
  };

  return (
    <div className={`w-full text-xs mb-2 ${className}`}>
      <div className="text-xs font-medium mb-1" title={label}>
        {label}
      </div>
      <div
        className={`border rounded-md p-2 ${statusColors[status]} ${
          isLoading ? "opacity-50" : ""
        }`}
      >
        <select
          value={status}
          onChange={handleChange}
          disabled={isLoading || !isEditable}
          className={`w-full bg-transparent border-none focus:ring-0 ${
            isEditable ? "cursor-pointer" : "cursor-not-allowed"
          } text-xs`}
          aria-label={`Update status for ${label}`}
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StatusBox;
