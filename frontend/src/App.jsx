import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

/* AUTH */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

/* PÚBLICO */
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Categories from "./pages/Categories";
import MyOrders from "./pages/orders/MyOrders";

/* ADMIN */
import AdminRoute from "./admin/AdminRoute";
import AdminLayout from "./admin/AdminLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCategoryForm from "./pages/admin/AdminCategoryForm";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  return (
    <Routes>

      {/* ===== PUBLIC ===== */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
      <Route path="/products/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
      <Route path="/categories" element={<MainLayout><Categories /></MainLayout>} />
      <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
      <Route path="/my-orders" element={<MainLayout><MyOrders /></MainLayout>} />

      {/* ===== AUTH ===== */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ===== ADMIN ===== */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id" element={<AdminProductForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="categories/new" element={<AdminCategoryForm />} />
        <Route path="categories/:id" element={<AdminCategoryForm />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      {/* ===== 404 ===== */}
      <Route
        path="*"
        element={
          <MainLayout>
            <h1 className="text-center text-2xl mt-10">
              Página no encontrada
            </h1>
          </MainLayout>
        }
      />
    </Routes>
  );
}
