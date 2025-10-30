import React from "react";
import { WarningOutlined } from "@ant-design/icons";

const ErrorPlaceholder = ({ message = "Data is currently unavailable.", subMessage = "Please try again later." }) => {
  return (
    <div className="text-center p-6 flex flex-col items-center gap-2">
      <WarningOutlined className="text-4xl text-gray-400 mb-1" />
      <div className="text-base font-normal text-gray-700">
        {message}
      </div>
      <div className="text-sm text-gray-500">
        {subMessage}
      </div>
    </div>
  );
};

export default ErrorPlaceholder;
