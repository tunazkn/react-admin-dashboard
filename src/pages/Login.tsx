// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import { isValidEmail } from "../utils/validation";
import { useTranslation } from "react-i18next";
import usePageTitle from "../hooks/usePageTitle";

import LoginIcon from "@mui/icons-material/Login";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import CircularProgress from "@mui/material/CircularProgress";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  usePageTitle("auth.login.title");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasyon
    if (!email || !password) {
      setError(t("common.messages.fillInAllFields"));
      return;
    }
    if (!isValidEmail(email)) {
      setError(t("common.messages.enterValidEmailAddress"));
      return;
    }

    setLoading(true);

    try {
      // Servise istek atma simülasyonu
      const response = await authService.login(email, password);

      if (response.success && response.data) {
        login(response.data);
        navigate("/");
      } else {
        setError(t(response.message || "auth.errors.generalError"));
      }
    } catch (err) {
      setError(t("common.errors.serverError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-body-tertiary">
      <div
        className="card shadow-lg p-4"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        <div className="card-body">
          <div className="text-center mb-4">
            <div
              className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "60px", height: "60px" }}
            >
              <LockIcon fontSize="large" />
            </div>
            <h3 className="fw-bold">{t("auth.login.title")}</h3>
          </div>

          {error && (
            <div className="alert alert-danger text-center p-2 small">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-bold">
                {t("common.form.email")}
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <EmailIcon color="action" />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">
                {t("common.form.password")}
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <LockIcon color="action" />
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <>
                  <LoginIcon /> {t("auth.login.submitButton")}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
