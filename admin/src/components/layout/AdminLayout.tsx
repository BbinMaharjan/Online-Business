import { Outlet } from "react-router-dom";
import { Layout, ConfigProvider } from "antd";
import { Sidebar } from "./Sidebar";
import { HeaderComponent } from "./Header";
import { useAppSelector } from "../../store/hooks";
import styles from "./AdminLayout.module.css";
import { theme } from "antd";

const { Content, Footer } = Layout;
const { darkAlgorithm } = theme;

export const AdminLayout = () => {
  const themeMode = useAppSelector((state) => state.ui.theme);
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  return (
    <ConfigProvider
      theme={{ algorithm: themeMode === "dark" ? darkAlgorithm : undefined }}
    >
      <Layout className={styles.layout} style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout className={styles.mainLayout}>
          <HeaderComponent />
          <Content className={styles.content}>
            <Outlet />
          </Content>
          <Footer className={styles.footer}>
            E-Commerce Admin Portal © {new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
