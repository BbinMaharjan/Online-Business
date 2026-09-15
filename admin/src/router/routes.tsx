import { Suspense, lazy } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AdminLayout } from "../components/layout/AdminLayout";
import LoginPage from "../features/auth/LoginPage";
import { useAppSelector } from "../store/hooks";

// Lazy load page components
const DashboardPage = lazy(() => import("../features/dashboard/DashboardPage"));
const ProductListPage = lazy(
  () => import("../features/products/ProductListPage"),
);
const ProductFormPage = lazy(
  () => import("../features/products/ProductFormPage"),
);
const ProductDetailPage = lazy(
  () => import("../features/products/ProductDetailPage"),
);
const CategoryListPage = lazy(
  () => import("../features/categories/CategoryListPage"),
);
const CategoryFormPage = lazy(
  () => import("../features/categories/CategoryFormPage"),
);
const BrandListPage = lazy(() => import("../features/brands/BrandListPage"));
const BrandFormPage = lazy(() => import("../features/brands/BrandFormPage"));
const InventoryPage = lazy(() => import("../features/inventory/InventoryPage"));
const InventoryDetailPage = lazy(
  () => import("../features/inventory/InventoryDetailPage"),
);
const OrderListPage = lazy(() => import("../features/orders/OrderListPage"));
const OrderDetailPage = lazy(
  () => import("../features/orders/OrderDetailPage"),
);
const CustomerListPage = lazy(
  () => import("../features/customers/CustomerListPage"),
);
const CustomerDetailPage = lazy(
  () => import("../features/customers/CustomerDetailPage"),
);
const CouponListPage = lazy(() => import("../features/coupons/CouponListPage"));
const CouponFormPage = lazy(() => import("../features/coupons/CouponFormPage"));
const ReviewListPage = lazy(() => import("../features/reviews/ReviewListPage"));
const PaymentListPage = lazy(
  () => import("../features/payments/PaymentListPage"),
);
const ShippingPage = lazy(() => import("../features/shipping/ShippingPage"));
const MediaPage = lazy(() => import("../features/media/MediaPage"));
const SalesReportPage = lazy(
  () => import("../features/reports/SalesReportPage"),
);
const ProductReportPage = lazy(
  () => import("../features/reports/ProductReportPage"),
);
const CustomerReportPage = lazy(
  () => import("../features/reports/CustomerReportPage"),
);
const NotificationPage = lazy(
  () => import("../features/notifications/NotificationPage"),
);
const AdministratorListPage = lazy(
  () => import("../features/administrators/AdministratorListPage"),
);
const RolesPage = lazy(() => import("../features/administrators/RolesPage"));
const SettingsPage = lazy(() => import("../features/settings/SettingsPage"));
const AuditLogPage = lazy(() => import("../features/audit-logs/AuditLogPage"));
const NotFoundPage = lazy(() => import("../features/not-found/NotFoundPage"));
const ForgotPasswordPage = lazy(() => import("../features/auth/ForgotPasswordPage"));
const RegisterPage = lazy(() => import("../features/auth/RegisterPage"));

const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  if (isLoading) {
    return <div className="loading-screen">Protected Route Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const PublicRoute = () => {
  const isAuthenticated = useAppSelector(
    (state: any) => state.auth.isAuthenticated,
  );
  const isLoading = useAppSelector((state: any) => state.auth.isLoading);

  if (isLoading) {
    return <div className="loading-screen">Public Route Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

// Wrapper with Suspense for lazy loading
export const AppRoutes = () => (
  <Suspense
    fallback={<div className="loading-screen">Suspense Loading...</div>}
  >
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/create" element={<ProductFormPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
          <Route path="categories" element={<CategoryListPage />} />
          <Route path="categories/create" element={<CategoryFormPage />} />
          <Route path="categories/:id/edit" element={<CategoryFormPage />} />
          <Route path="brands" element={<BrandListPage />} />
          <Route path="brands/create" element={<BrandFormPage />} />
          <Route path="brands/:id/edit" element={<BrandFormPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="inventory/:id" element={<InventoryDetailPage />} />
          <Route path="orders" element={<OrderListPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="customers" element={<CustomerListPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="coupons" element={<CouponListPage />} />
          <Route path="coupons/create" element={<CouponFormPage />} />
          <Route path="coupons/:id/edit" element={<CouponFormPage />} />
          <Route path="reviews" element={<ReviewListPage />} />
          <Route path="payments" element={<PaymentListPage />} />
          <Route path="shipping" element={<ShippingPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="reports/sales" element={<SalesReportPage />} />
          <Route path="reports/products" element={<ProductReportPage />} />
          <Route path="reports/customers" element={<CustomerReportPage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="administrators" element={<AdministratorListPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="audit-logs" element={<AuditLogPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  </Suspense>
);
