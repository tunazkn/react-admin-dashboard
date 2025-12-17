// src/pages/Dashboard.tsx
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

// JSON Verileri
import initialProductData from "../data/products.json";
import initialUserData from "../data/users.json";

// İkonlar
import GroupIcon from "@mui/icons-material/Group";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  image: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  usePageTitle(t("dashboard.title"));

  const [products] = useState<Product[]>(() => {
    const saved = localStorage.getItem("app_products");
    return saved ? JSON.parse(saved) : initialProductData;
  });

  const [users] = useState<User[]>(() => {
    const saved = localStorage.getItem("app_users");
    return saved ? JSON.parse(saved) : (initialUserData as unknown as User[]);
  });

  const kpiData = useMemo(() => {
    const totalProducts = products.length;
    const totalUsers = users.length;
    const totalInventoryValue = products.reduce(
      (acc, item) => acc + item.price * item.stock,
      0
    );
    const lowStockCount = products.filter((p) => p.stock < 10).length;
    const totalStockItems = products.reduce((acc, item) => acc + item.stock, 0);

    return {
      totalProducts,
      totalUsers,
      totalInventoryValue,
      lowStockCount,
      totalStockItems,
    };
  }, [products, users]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  const stats = [
    {
      id: 1,
      title: "dashboard.stats.inventoryValue",
      value: formatCurrency(kpiData.totalInventoryValue),
      change: `+${products.length}`,
      icon: <AttachMoneyIcon fontSize="large" />,
      color: "success",
      subText: "dashboard.stats.subtext.value",
    },
    {
      id: 2,
      title: "dashboard.stats.registeredUsers",
      value: kpiData.totalUsers,
      change: t("dashboard.stats.active"),
      icon: <GroupIcon fontSize="large" />,
      color: "primary",
      subText: "dashboard.stats.subtext.people",
    },
    {
      id: 3,
      title: "dashboard.stats.criticalStock",
      value: kpiData.lowStockCount,
      change: t("dashboard.stats.warning"),
      icon: <WarningAmberIcon fontSize="large" />,
      color: "danger",
      subText: "dashboard.stats.subtext.renew",
    },
    {
      id: 4,
      title: "dashboard.stats.warehouseOccupancy",
      value: kpiData.totalStockItems,
      change: t("dashboard.stats.unit"),
      icon: <InventoryIcon fontSize="large" />,
      color: "info",
      subText: "dashboard.stats.subtext.totalItem",
    },
  ];

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">{t("dashboard.title")}</h2>
          <p className="text-muted mb-0">{t("dashboard.subtitle")}</p>
        </div>
        <Link
          to="/products"
          className="btn btn-primary d-flex align-items-center gap-2"
        >
          <TrendingUpIcon /> {t("dashboard.buttons.manageProducts")}
        </Link>
      </div>

      <div className="row g-4 mb-4">
        {stats.map((stat) => (
          <div className="col-12 col-md-6 col-xl-3" key={stat.id}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h6 className="card-subtitle text-muted mb-1 small text-uppercase fw-bold">
                      {t(stat.title)}
                    </h6>
                    <h2 className="card-title fw-bold mb-0">{stat.value}</h2>
                  </div>
                  <div
                    className={`d-flex align-items-center justify-content-center rounded-circle bg-${stat.color} bg-opacity-10 text-${stat.color}`}
                    style={{ width: 50, height: 50 }}
                  >
                    {stat.icon}
                  </div>
                </div>
                <div className="small">
                  <span
                    className={`fw-bold ${
                      stat.color === "danger" ? "text-danger" : "text-success"
                    }`}
                  >
                    {stat.change}
                  </span>{" "}
                  <span className="text-muted ms-1">{t(stat.subText)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0 fw-bold">
                {t("dashboard.inventoryStatus.title")}
              </h5>
              <Link
                to="/products"
                className="btn btn-sm text-muted d-flex align-items-center gap-1"
              >
                {t("dashboard.inventoryStatus.viewAll")}{" "}
                <ArrowForwardIcon fontSize="inherit" />
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-body-tertiary">
                    <tr>
                      <th className="ps-4 text-secondary">
                        {t("dashboard.inventoryStatus.table.product")}
                      </th>
                      <th className="text-secondary">
                        {t("dashboard.inventoryStatus.table.price")}
                      </th>
                      <th className="text-secondary">
                        {t("dashboard.inventoryStatus.table.stock")}
                      </th>
                      <th className="text-secondary">
                        {t("dashboard.inventoryStatus.table.status")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 5).map((product) => (
                      <tr key={product.id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center">
                            <img
                              src={product.image}
                              alt=""
                              className="rounded me-2 bg-light border"
                              style={{
                                width: 36,
                                height: 36,
                                objectFit: "cover",
                              }}
                            />
                            <span className="fw-bold text-body-emphasis">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td>{formatCurrency(product.price)}</td>
                        <td className="fw-bold text-muted">{product.stock}</td>
                        <td>
                          {product.stock === 0 ? (
                            <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25">
                              {t("dashboard.status.outOfStock")}
                            </span>
                          ) : product.stock < 10 ? (
                            <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25">
                              {t("dashboard.status.critical")}
                            </span>
                          ) : (
                            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">
                              {t("dashboard.status.available")}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="fw-bold mb-3">
                {t("dashboard.systemSummary.title")}
              </h6>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  {t("dashboard.systemSummary.totalProduct")}
                  <span className="badge bg-primary rounded-pill">
                    {kpiData.totalProducts}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  {t("dashboard.systemSummary.activeUser")}
                  <span className="badge bg-info rounded-pill">
                    {kpiData.totalUsers}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  {t("dashboard.systemSummary.outOfStock")}
                  <span className="badge bg-danger rounded-pill">
                    {products.filter((p) => p.stock === 0).length}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 py-3">
              <h6 className="mb-0 fw-bold">{t("dashboard.capacity.title")}</h6>
            </div>
            <div className="card-body pt-0">
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <small className="text-muted fw-bold">
                    {t("dashboard.capacity.usage")}
                  </small>
                  <small className="fw-bold text-primary">65%</small>
                </div>
                <div className="progress" style={{ height: 6 }}>
                  <div className="progress-bar" style={{ width: "65%" }}></div>
                </div>
              </div>
              <div className="alert alert-light border border-secondary border-opacity-25 small text-muted mb-0">
                {t("dashboard.capacity.info", {
                  value: formatCurrency(kpiData.totalInventoryValue),
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
