// src/pages/Settings.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

// İkonlar
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import TuneIcon from "@mui/icons-material/Tune";
import SaveIcon from "@mui/icons-material/Save";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LanguageIcon from "@mui/icons-material/Language";

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  usePageTitle(t("settings.title"));
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    name: user?.name || "Admin User",
    email: user?.email || "admin@demo.com",
    bio: "Frontend Developer & UI/UX Enthusiast",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  // Kaydetme Simülasyonu
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t("settings.messages.saved"));
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">{t("settings.title")}</h2>
        <p className="text-muted">{t("settings.subtitle")}</p>
      </div>

      <div className="row">
        {/* --- SOL MENÜ (SEKMELER) --- */}
        <div className="col-md-3 mb-4">
          <div className="card border shadow-sm">
            <div className="list-group list-group-flush rounded-3">
              <button
                className={`list-group-item list-group-item-action d-flex align-items-center gap-2 p-3 ${
                  activeTab === "profile" ? "active fw-bold" : ""
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <PersonIcon fontSize="small" /> {t("settings.tabs.profile")}
              </button>
              <button
                className={`list-group-item list-group-item-action d-flex align-items-center gap-2 p-3 ${
                  activeTab === "security" ? "active fw-bold" : ""
                }`}
                onClick={() => setActiveTab("security")}
              >
                <LockIcon fontSize="small" /> {t("settings.tabs.security")}
              </button>
              <button
                className={`list-group-item list-group-item-action d-flex align-items-center gap-2 p-3 ${
                  activeTab === "preferences" ? "active fw-bold" : ""
                }`}
                onClick={() => setActiveTab("preferences")}
              >
                <TuneIcon fontSize="small" /> {t("settings.tabs.preferences")}
              </button>
            </div>
          </div>
        </div>

        {/* --- SAĞ İÇERİK --- */}
        <div className="col-md-9">
          {activeTab === "profile" && (
            <div className="card border shadow-sm">
              <div className="card-header bg-transparent border py-3">
                <h5 className="mb-0 fw-bold">{t("settings.profile.title")}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSave}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        {t("settings.profile.name")}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        {t("settings.profile.email")}
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">
                      {t("settings.profile.bio")}
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary d-flex align-items-center gap-2"
                    >
                      <SaveIcon fontSize="small" /> {t("settings.buttons.save")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="card border shadow-sm">
              <div className="card-header bg-transparent border py-3">
                <h5 className="mb-0 fw-bold">{t("settings.security.title")}</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSave}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">
                      {t("settings.security.currentPassword")}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.current}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          current: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        {t("settings.security.newPassword")}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordData.new}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            new: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted">
                        {t("settings.security.confirmPassword")}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordData.confirm}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirm: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary d-flex align-items-center gap-2"
                    >
                      <SaveIcon fontSize="small" />{" "}
                      {t("settings.buttons.updatePassword")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="card border shadow-sm">
              <div className="card-header bg-transparent border py-3">
                <h5 className="mb-0 fw-bold">
                  {t("settings.preferences.title")}
                </h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom border-secondary border-opacity-10">
                  <div>
                    <h6 className="fw-bold mb-1 d-flex align-items-center gap-2">
                      {theme === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
                      {t("settings.preferences.themeTitle")}
                    </h6>
                    <small className="text-muted">
                      {t("settings.preferences.themeDesc")}
                    </small>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={theme === "dark"}
                      onChange={toggleTheme}
                      style={{ width: "3em", height: "1.5em" }}
                    />
                  </div>
                </div>

                <div>
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <LanguageIcon /> {t("settings.preferences.langTitle")}
                  </h6>
                  <div className="btn-group w-100" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="btnradio"
                      id="btnradio1"
                      autoComplete="off"
                      checked={i18n.language === "tr"}
                      onChange={() => changeLanguage("tr")}
                    />
                    <label
                      className="btn btn-outline-primary"
                      htmlFor="btnradio1"
                    >
                      Türkçe
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="btnradio"
                      id="btnradio2"
                      autoComplete="off"
                      checked={i18n.language === "en"}
                      onChange={() => changeLanguage("en")}
                    />
                    <label
                      className="btn btn-outline-primary"
                      htmlFor="btnradio2"
                    >
                      English
                    </label>
                  </div>
                  <small className="text-muted d-block mt-2">
                    {t("settings.preferences.langDesc")}
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
