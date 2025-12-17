// src/components/Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

// İkonlar
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Avatar from "@mui/material/Avatar";

const Sidebar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const menuItems = [
    {
      path: "/",
      label: t("sidebar.dashboard"),
      icon: <HomeIcon className="me-3" />,
    },
    {
      path: "/users",
      label: t("sidebar.users"),
      icon: <PeopleIcon className="me-3" />,
    },
    {
      path: "/products",
      label: t("sidebar.products"),
      icon: <InventoryIcon className="me-3" />,
    },
    {
      path: "/settings",
      label: t("sidebar.settings"),
      icon: <SettingsIcon className="me-3" />,
    },
  ];

  // İsimden baş harfleri çıkaran yardımcı fonksiyon
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark vh-100 shadow-sm"
      style={{ width: "280px", height: "100vh", transition: "all 0.3s" }}
    >
      {/* --- LOGO ALANI --- */}
      <div className="p-4 d-flex align-items-center text-white text-decoration-none border-bottom border-secondary">
        <AdminPanelSettingsIcon className="fs-2 me-2 text-primary" />
        <span className="fs-5 fw-bold tracking-tight">
          {t("sidebar.adminPanel")}
        </span>
      </div>

      {/* --- MENÜ LİNKLERİ --- */}
      <div className="p-3 overflow-auto custom-scrollbar">
        <ul className="nav nav-pills flex-column mb-auto gap-2">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.path}>
              <Link
                to={item.path}
                className={`nav-link text-white d-flex align-items-center p-3 ${
                  location.pathname === item.path
                    ? "active bg-primary"
                    : "link-body-emphasis"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* --- ALT KISIM (Footer) --- */}
      <div className="mt-auto pt-3 ">
        {/* Dil Seçimi */}
        <div className="d-flex justify-content-between align-items-center p-2 mb-3 rounded border border-secondary border-opacity-25">
          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn ${
                i18n.language === "tr" ? "btn-primary" : "btn-outline-secondary"
              } py-0 px-2`}
              style={{
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
              onClick={() => changeLanguage("tr")}
            >
              TR
            </button>
            <button
              className={`btn ${
                i18n.language === "en" ? "btn-primary" : "btn-outline-secondary"
              }`}
              style={{
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
              onClick={() => changeLanguage("en")}
            >
              EN
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="btn btn-sm btn-link text-decoration-none p-0 d-flex align-items-center"
          >
            {theme === "dark" ? (
              <LightModeIcon className="text-warning" fontSize="small" />
            ) : (
              <DarkModeIcon className="text-secondary" fontSize="small" />
            )}
          </button>
        </div>

        {/* Kullanıcı Profili (Dropup) */}
        <div className="dropup border-top pt-3 border-secondary border-opacity-25">
          <a
            href="#"
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle mt-2 w-100 px-2 rounded hover-bg-secondary"
            id="dropdownUser1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ transition: "0.2s", cursor: "pointer" }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
                marginRight: 1.5,
              }}
            >
              {user?.name ? getInitials(user.name) : "U"}
            </Avatar>

            {/* İsim ve Rol */}
            <div
              className="d-flex flex-column me-auto"
              style={{ lineHeight: "1.2" }}
            >
              <strong className="fw-bold small">{user?.name}</strong>
              <small className="text-white-50" style={{ fontSize: "0.75rem" }}>
                {user?.role || "Admin"}
              </small>
            </div>
          </a>

          {/* Açılır Menü */}
          <ul
            className="dropdown-menu dropdown-menu-dark text-small shadow w-100 "
            aria-labelledby="dropdownUser1"
          >
            <li>
              <Link className="dropdown-item " to="/settings">
                <SettingsIcon fontSize="small" /> {t("sidebar.settings")}
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button className="dropdown-item text-danger" onClick={logout}>
                <LogoutIcon fontSize="small" /> {t("sidebar.logout")}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
