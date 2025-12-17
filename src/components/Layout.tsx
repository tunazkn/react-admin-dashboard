// src/components/Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
  return (
    <div className="d-flex">
      {/* Sol Tarafta Sidebar */}
      <Sidebar />

      {/* Sağ Tarafta Değişen İçerik */}
      <div
        className="flex-grow-1 p-4 bg-body-tertiary"
        style={{ minHeight: "100vh", overflowY: "auto" }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
