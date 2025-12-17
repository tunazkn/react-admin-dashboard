// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Products from "./pages/Products";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          {/* ProtectedRoute izin verirse Layout çalışır */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
