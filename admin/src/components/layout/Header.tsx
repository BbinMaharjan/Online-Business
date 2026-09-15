import { Layout, Breadcrumb, Space, Tooltip, Switch } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SunOutlined,
  MoonOutlined,
  BellOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { toggleSidebar, setTheme } from "../../store/uiSlice";
import styles from "./Header.module.css";

const { Header } = Layout;

export const HeaderComponent = () => {
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);
  const theme = useAppSelector((state) => state.ui.theme);
  const breadcrumbs = useAppSelector((state) => state.ui.breadcrumbs);
  const dispatch = useAppDispatch();

  const handleThemeChange = (checked: boolean) => {
    dispatch(setTheme(checked ? "dark" : "light"));
  };

  return (
    <Header className={styles.header}>
      <div className={styles.left}>
        <Tooltip title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
          <button
            className={styles.trigger}
            onClick={() => dispatch(toggleSidebar())}
            aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </Tooltip>
        <Breadcrumb
          className={styles.breadcrumb}
          separator="/"
          items={
            breadcrumbs.length > 0 ? breadcrumbs : [{ label: "Dashboard" }]
          }
        />
      </div>
      <div className={styles.right}>
        <Tooltip title="Search">
          <button className={styles.iconButton}>
            <SearchOutlined />
          </button>
        </Tooltip>
        <Tooltip title="Notifications">
          <button className={styles.iconButton}>
            <BellOutlined />
          </button>
        </Tooltip>
        <Tooltip
          title={
            theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
        >
          <Switch
            checked={theme === "dark"}
            onChange={handleThemeChange}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </Tooltip>
      </div>
    </Header>
  );
};
