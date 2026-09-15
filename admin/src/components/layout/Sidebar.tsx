import { NavLink, useLocation } from "react-router-dom";
import { Menu, Layout, Avatar, Dropdown, Tooltip } from "antd";
import {
  DashboardOutlined,
  BoxPlotOutlined,
  AppstoreOutlined,
  TagsOutlined,
  ShoppingOutlined,
  TeamOutlined,
  DollarCircleOutlined,
  StarOutlined,
  AuditOutlined,
  SettingOutlined,
  SafetyOutlined,
  FileTextOutlined,
  PictureOutlined,
  NotificationOutlined,
  UsergroupAddOutlined,
  UnorderedListOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  TruckOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { toggleSidebar } from "../../store/uiSlice";
import { clearAuth } from "../../store/authSlice";
import { setSidebarCollapsed } from "../../store/uiSlice";
import { PermissionGuard } from "../common/PermissionGuard";
import styles from "./Sidebar.module.css";

const { Sider } = Layout;

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  permission?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <DashboardOutlined />,
    path: "/dashboard",
    permission: "DASHBOARD_READ",
  },
  {
    key: "catalog",
    label: "Catalog",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "products",
        label: "Products",
        icon: <BoxPlotOutlined />,
        path: "/products",
        permission: "PRODUCT_READ",
      },
      {
        key: "categories",
        label: "Categories",
        icon: <TagsOutlined />,
        path: "/categories",
        permission: "CATEGORY_READ",
      },
      {
        key: "brands",
        label: "Brands",
        icon: <StarOutlined />,
        path: "/brands",
        permission: "BRAND_READ",
      },
    ],
  },
  {
    key: "sales",
    label: "Sales",
    icon: <ShoppingOutlined />,
    children: [
      {
        key: "orders",
        label: "Orders",
        icon: <ShoppingCartOutlined />,
        path: "/orders",
        permission: "ORDER_READ",
      },
      {
        key: "payments",
        label: "Payments",
        icon: <DollarCircleOutlined />,
        path: "/payments",
        permission: "PAYMENT_READ",
      },
      {
        key: "coupons",
        label: "Coupons",
        icon: <StarOutlined />,
        path: "/coupons",
        permission: "COUPON_READ",
      },
      {
        key: "shipping",
        label: "Shipping",
        icon: <TruckOutlined />,
        path: "/shipping",
        permission: "SHIPPING_READ",
      },
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    icon: <BoxPlotOutlined />,
    path: "/inventory",
    permission: "INVENTORY_READ",
  },
  {
    key: "customers",
    label: "Customers",
    icon: <TeamOutlined />,
    path: "/customers",
    permission: "CUSTOMER_READ",
  },
  {
    key: "engagement",
    label: "Engagement",
    icon: <StarOutlined />,
    children: [
      {
        key: "reviews",
        label: "Reviews",
        icon: <FileTextOutlined />,
        path: "/reviews",
        permission: "REVIEW_READ",
      },
      {
        key: "notifications",
        label: "Notifications",
        icon: <NotificationOutlined />,
        path: "/notifications",
        permission: "NOTIFICATION_READ",
      },
    ],
  },
  {
    key: "reports",
    label: "Reports",
    icon: <FileTextOutlined />,
    children: [
      {
        key: "sales-reports",
        label: "Sales",
        icon: <BarChartOutlined />,
        path: "/reports/sales",
        permission: "REPORT_READ",
      },
      {
        key: "product-reports",
        label: "Products",
        icon: <BoxPlotOutlined />,
        path: "/reports/products",
        permission: "REPORT_READ",
      },
      {
        key: "customer-reports",
        label: "Customers",
        icon: <TeamOutlined />,
        path: "/reports/customers",
        permission: "REPORT_READ",
      },
    ],
  },
  {
    key: "media",
    label: "Media",
    icon: <PictureOutlined />,
    path: "/media",
    permission: "MEDIA_READ",
  },
  {
    key: "administration",
    label: "Administration",
    icon: <SafetyOutlined />,
    children: [
      {
        key: "administrators",
        label: "Administrators",
        icon: <UsergroupAddOutlined />,
        path: "/administrators",
        permission: "ADMIN_READ",
      },
      {
        key: "roles",
        label: "Roles & Permissions",
        icon: <SafetyOutlined />,
        path: "/roles",
        permission: "ROLE_READ",
      },
      {
        key: "audit-logs",
        label: "Audit Logs",
        icon: <AuditOutlined />,
        path: "/audit-logs",
        permission: "AUDIT_LOG_READ",
      },
      {
        key: "settings",
        label: "Settings",
        icon: <SettingOutlined />,
        path: "/settings",
        permission: "SETTING_READ",
      },
    ],
  },
];

const renderMenuItems = (items: MenuItem[], collapsed: boolean) => {
  return items
    .map((item) => {
      if (item.children) {
        return (
          <PermissionGuard
            key={item.key}
            permission={item.permission || ""}
            fallback={null}
          >
            <Menu.SubMenu
              key={item.key}
              icon={item.icon}
              title={collapsed ? null : item.label}
            >
              {renderMenuItems(item.children, collapsed)}
            </Menu.SubMenu>
          </PermissionGuard>
        );
      }
      return (
        <PermissionGuard
          key={item.key}
          permission={item.permission || ""}
          fallback={null}
        >
          <Menu.Item key={item.path!} icon={item.icon}>
            {collapsed ? null : (
              <NavLink
                to={item.path!}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                }}
              >
                {item.label}
              </NavLink>
            )}
          </Menu.Item>
        </PermissionGuard>
      );
    })
    .filter(Boolean);
};

export const Sidebar = () => {
  const location = useLocation();
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const admin = useAppSelector((state) => state.auth.admin);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearAuth());
  };

  const profileMenuItems = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: () => console.log("Profile clicked"),
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className={styles.sider}
      breakpoint="lg"
      onBreakpoint={() => dispatch(setSidebarCollapsed(true))}
      onCollapse={(collapsed) => dispatch(setSidebarCollapsed(collapsed))}
    >
      <div className={styles.logo}>
        {collapsed ? <AppstoreOutlined /> : <span>Admin Portal</span>}
      </div>
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={[location.pathname]}
        items={renderMenuItems(menuItems, collapsed)}
        style={{ borderRight: "none" }}
      />
      {!collapsed && admin && (
        <div className={styles.profile}>
          <Dropdown
            menu={{
              items: profileMenuItems,
            }}
            placement="bottomLeft"
          >
            <div className={styles.profileWrapper}>
              <Avatar
                size={32}
                src={admin.avatar || undefined}
                icon={<UserOutlined />}
              >
                {admin.firstName?.[0]}
                {admin.lastName?.[0]}
              </Avatar>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>
                  {admin.firstName} {admin.lastName}
                </span>
                <span className={styles.profileRole}>{admin.role}</span>
              </div>
            </div>
          </Dropdown>
        </div>
      )}
    </Sider>
  );
};
