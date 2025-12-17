// src/pages/Users.tsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import initialData from "../data/users.json";
import { isValidEmail } from "../utils/validation";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

// İkonlar
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const Users: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t("users.title"));
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("app_users");
    return savedUsers ? JSON.parse(savedUsers) : initialData;
  });

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Kullanıcı",
    status: "Aktif",
  });

  const [errors, setErrors] = useState({ name: "", email: "" });

  useEffect(() => {
    localStorage.setItem("app_users", JSON.stringify(users));
  }, [users]);

  const getRoleLabel = (role: string) => {
    const map: Record<string, string> = {
      Admin: "users.roles.admin",
      Editör: "users.roles.editor",
      Kullanıcı: "users.roles.user",
    };
    return map[role] ? t(map[role]) : role;
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      Aktif: "users.status.active",
      Pasif: "users.status.passive",
      Beklemede: "users.status.pending",
    };
    return map[status] ? t(map[status]) : status;
  };

  // Modal Açma (Ekleme Modalı)
  const handleShowAdd = () => {
    setEditingId(null);
    setErrors({ name: "", email: "" });
    setFormData({ name: "", email: "", role: "Kullanıcı", status: "Aktif" });
    setShowModal(true);
  };

  // Modal Açma (Düzenleme Modalı)
  const handleShowEdit = (user: User) => {
    setEditingId(user.id);
    setErrors({ name: "", email: "" });

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "" };

    if (!formData.name.trim()) {
      newErrors.name = t("users.messages.nameRequired");
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = t("users.messages.emailRequired");
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t("users.messages.emailInvalid");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // KAYDETME FONKSİYONU (Hem Ekleme Hem Güncelleme için)
  const handleSave = () => {
    if (!validateForm()) return;

    if (editingId) {
      // --- GÜNCELLEME ---
      const updatedUsers = users.map((user) =>
        user.id === editingId ? { ...user, ...formData } : user
      );
      setUsers(updatedUsers);
    } else {
      // --- YENİ EKLEME ---
      const newId =
        users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      const newUser: User = { id: newId, ...formData };
      setUsers([...users, newUser]);
    }

    handleClose();
  };

  const handleDelete = (id: number) => {
    // Sadece Admin silebilir
    if (currentUser?.role !== "Admin") {
      alert(t("users.messages.noPermission"));
      return;
    }

    if (window.confirm(t("users.messages.confirmDelete"))) {
      const newUsers = users.filter((user) => user.id !== id);
      setUsers(newUsers);
    }
  };

  const handleReset = () => {
    if (window.confirm(t("users.messages.confirmReset"))) {
      setUsers(initialData);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{t("users.title")}</h2>
          <small className="text-muted">
            {t("users.subtitle", { count: users.length })}
          </small>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            onClick={handleReset}
          >
            <RefreshIcon fontSize="small" />
            {t("users.buttons.reset")}
          </button>
          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-2"
            onClick={handleShowAdd}
          >
            <AddIcon fontSize="small" />
            {t("users.buttons.addNew")}
          </button>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <table className="table table-hover table-striped align-middle mb-0">
            <thead className="bg-body-tertiary text-secondary">
              <tr>
                <th className="ps-4">#</th>
                <th>{t("users.table.name")}</th>
                <th>{t("users.table.email")}</th>
                <th>{t("users.table.role")}</th>
                <th>{t("users.table.status")}</th>
                <th className="text-end pe-4">{t("users.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="ps-4 fw-bold text-muted">{user.id}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                        style={{
                          width: "35px",
                          height: "35px",
                          fontSize: "14px",
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td className="text-muted">{user.email}</td>
                  <td>
                    <span
                      className={`badge rounded-pill ${
                        user.role === "Admin"
                          ? "bg-danger"
                          : user.role === "Editör"
                          ? "bg-info"
                          : "bg-secondary"
                      }`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td>
                    {user.status === "Aktif" ? (
                      <span className="badge bg-success bg-opacity-10 text-success d-inline-flex align-items-center gap-1 border border-success border-opacity-25">
                        <CheckCircleIcon style={{ fontSize: 14 }} />
                        {getStatusLabel(user.status)}
                      </span>
                    ) : (
                      <span className="badge bg-secondary bg-opacity-10 text-secondary d-inline-flex align-items-center gap-1 border border-secondary border-opacity-25">
                        <CancelIcon style={{ fontSize: 14 }} />{" "}
                        {getStatusLabel(user.status)}
                      </span>
                    )}
                  </td>
                  <td className="text-end pe-4">
                    <button
                      className="btn btn-sm btn-outline-warning me-2 border-0"
                      onClick={() => handleShowEdit(user)}
                      title={t("users.buttons.edit")}
                    >
                      <EditIcon fontSize="small" />
                    </button>

                    {/* Sil Butonu: SADECE ADMIN GÖREBİLİR */}
                    {currentUser?.role === "Admin" && (
                      <button
                        className="btn btn-sm btn-outline-danger border-0"
                        onClick={() => handleDelete(user.id)}
                        title={t("users.buttons.delete")}
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ORTAK MODAL (EKLEME & DÜZENLEME) --- */}
      <Modal show={showModal} onHide={handleClose} centered backdrop="static">
        <Modal.Header closeButton className="bg-body-tertiary">
          <Modal.Title className="fs-5">
            {editingId ? (
              <>
                <EditIcon className="me-2" />
                {t("users.modal.titleEdit")}
              </>
            ) : (
              <>
                <AddIcon className="me-2" />
                {t("users.modal.titleAdd")}
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small text-muted fw-bold">
                {t("users.modal.nameLabel")}
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small text-muted fw-bold">
                {t("users.modal.emailLabel")}
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold">
                    {t("users.modal.roleLabel")}
                  </Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="Kullanıcı">{t("users.roles.user")}</option>
                    <option value="Editör">{t("users.roles.editor")}</option>
                    <option value="Admin">{t("users.roles.admin")}</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="small text-muted fw-bold">
                    {t("users.modal.statusLabel")}
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Aktif">{t("users.status.active")}</option>
                    <option value="Pasif">{t("users.status.passive")}</option>
                    <option value="Beklemede">
                      {t("users.status.pending")}
                    </option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-body-tertiary">
          <Button
            variant="link"
            className="text-decoration-none text-secondary"
            onClick={handleClose}
          >
            {t("users.buttons.cancel")}
          </Button>
          <Button variant="primary" onClick={handleSave} className="px-4">
            <SaveIcon fontSize="small" className="me-2" />
            {editingId
              ? t("users.buttons.saveChanges")
              : t("users.buttons.createUser")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
