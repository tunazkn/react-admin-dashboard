// src/pages/Products.tsx
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import initialProducts from "../data/products.json";
import usePageTitle from "../hooks/usePageTitle";

// İkonlar
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

const formatCurrency = (amount: number, language: string) => {
  return new Intl.NumberFormat(language === "tr" ? "tr-TR" : "en-US", {
    style: "currency",
    currency: language === "tr" ? "TRY" : "USD",
  }).format(language === "tr" ? amount : amount / 42.72);
};

const Products: React.FC = () => {
  const { t, i18n } = useTranslation();
  usePageTitle(t("products.title"));

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Product>({
    id: 0,
    name: "",
    category: "electronics",
    price: 0,
    stock: 0,
    image: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShowAdd = () => {
    setEditingId(null);
    setFormData({
      id: 0,
      name: "",
      category: "electronics",
      price: 0,
      stock: 0,
      image: "https://via.placeholder.com/150",
    });
    setShowModal(true);
  };

  const handleShowEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleSave = () => {
    if (!formData.name || formData.price < 0) return;

    if (editingId) {
      setProducts(products.map((p) => (p.id === editingId ? formData : p)));
    } else {
      const newId =
        products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      setProducts([...products, { ...formData, id: newId }]);
    }
    handleClose();
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t("common.confirmDelete"))) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "price" || name === "stock") {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>{t("products.title")}</h2>
          <small className="text-muted">
            {products.length} {i18n.language === "tr" ? "ürün" : "products"}
          </small>
        </div>
        <button
          className="btn btn-primary btn-sm d-flex align-items-center gap-2"
          onClick={handleShowAdd}
        >
          <AddIcon fontSize="small" />
          {t("products.addProduct")}
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-body-tertiary">
              <tr>
                <th className="ps-4">{t("products.table.image")}</th>
                <th>{t("products.table.name")}</th>
                <th>{t("products.table.category")}</th>
                <th>{t("products.table.price")}</th>
                <th>{t("products.table.stock")}</th>
                <th>{t("products.table.status")}</th>
                <th className="text-end pe-4">{t("products.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="ps-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="rounded border shadow-sm"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td className="fw-bold">{product.name}</td>
                  <td>
                    <span className="badge rounded-pill bg-transparent border border-secondary text-body-emphasis p-2 px-3 fw-normal">
                      {t(
                        `products.categories.${product.category.toLowerCase()}`,
                        product.category
                      )}
                    </span>
                  </td>
                  <td className="fw-bold text-primary">
                    {formatCurrency(product.price, i18n.language)}
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    {product.stock === 0 ? (
                      <span className="badge bg-danger">
                        {t("products.status.outOfStock")}
                      </span>
                    ) : product.stock < 10 ? (
                      <span className="badge bg-warning">
                        {t("products.status.lowStock")}
                      </span>
                    ) : (
                      <span className="badge bg-success">
                        {t("products.status.inStock")}
                      </span>
                    )}
                  </td>
                  <td className="text-end pe-4">
                    <button
                      className="btn btn-sm btn-outline-warning me-2 border-0"
                      onClick={() => handleShowEdit(product)}
                    >
                      <EditIcon fontSize="small" />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger border-0"
                      onClick={() => handleDelete(product.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton className="bg-body-tertiary">
          <Modal.Title>
            {editingId ? t("common.edit") : t("products.addProduct")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-4 text-center border-end">
              <div className="mb-3">
                <img
                  src={formData.image || "https://via.placeholder.com/150"}
                  alt="Preview"
                  className="img-thumbnail mb-3"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "contain",
                    backgroundColor: "#f8f9fa",
                  }}
                />
                <label className="btn btn-outline-primary btn-sm w-100">
                  <CloudUploadIcon className="me-2" />{" "}
                  {i18n.language === "tr" ? "Resim Seç" : "Choose Image"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            <div className="col-md-8">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small">
                    {t("products.table.name")}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold small">
                        {t("products.table.category")}
                      </Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="electronics">
                          {t("products.categories.electronics")}
                        </option>
                        <option value="clothing">
                          {t("products.categories.clothing")}
                        </option>
                        <option value="accessories">
                          {t("products.categories.accessories")}
                        </option>
                        <option value="computers">
                          {t("products.categories.computers")}
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold small">
                        {t("products.table.price")}
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small">
                    {t("products.table.stock")}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    {t("products.messages.stockHelper")}
                  </Form.Text>
                </Form.Group>
              </Form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-body-tertiary">
          <Button
            variant="link"
            className="text-secondary text-decoration-none"
            onClick={handleClose}
          >
            {t("common.cancel")}
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <SaveIcon fontSize="small" className="me-2" />
            {t("common.save")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;
