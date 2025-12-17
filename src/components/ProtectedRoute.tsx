// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuth();

  // Eğer sayfa yenileniyorsa loading göster
  if (isLoading) {
    return <div className="p-4 text-center">{t("common.loading")}</div>;
  }
  // Eğer giriş yapılmışsa sayfayı göster (Outlet), yapılmamışsa Login sayfasına gönder (Navigate)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
