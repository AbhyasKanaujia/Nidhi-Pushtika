import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-300 py-4 mt-10">
      <div className="max-w-7xl mx-auto text-center">
        <Text type="secondary" style={{ fontSize: 14 }}>
          &copy; {currentYear} Nidhi Pushtika. All rights reserved.
        </Text>
      </div>
    </footer>
  );
};

export default Footer;
