import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Typography, Button, Dropdown, Menu } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const { Text } = Typography;

const HeaderBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)"); // Tailwind's sm breakpoint
    setIsMobile(mediaQuery.matches);

    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (!user) {
    return null; // Do not render header if not logged in
  }

  const navLinks = [
    { key: "transactions", to: "/transactions", label: "Transactions", roles: ["admin", "editor", "reader"] },
    { key: "reports", to: "/reports", label: "Reports", roles: ["admin", "editor", "reader"] },
    { key: "users", to: "/users", label: "Users", roles: ["admin"] },
  ];

  const menu = (
    <Menu>
      {navLinks
        .filter((link) => link.roles.includes(user.role))
        .map((link) => (
          <Menu.Item key={link.key}>
            <Link to={link.to}>{link.label}</Link>
          </Menu.Item>
        ))}
    </Menu>
  );

  return (
    <header className="bg-gray-100 shadow px-6 py-3">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <Dropdown overlay={menu} trigger={['click']}>
              <Button
                icon={<MenuOutlined />}
                type="text"
                aria-label="Navigation menu"
              />
            </Dropdown>
          )}
          <Text strong style={{ fontSize: 20, color: "#1890ff" }}>
            Nidhi Pushtika
          </Text>
          {!isMobile && (
            <div className="flex space-x-6">
              {navLinks
                .filter((link) => link.roles.includes(user.role))
                .map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-gray-700 hover:text-blue-600 font-medium ${
                      location.pathname === link.to ? "text-blue-700 underline" : ""
                    }`}
                  >
                    <Text>{link.label}</Text>
                  </Link>
                ))}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {!isMobile && <Text className="text-gray-800">Logged in as: {user.name}</Text>}
          <Button type="primary" onClick={logout}>
            Logout
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default HeaderBar;
