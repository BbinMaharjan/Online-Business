import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Button,
  Space,
  Dropdown,
  Menu,
} from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  BoxPlotOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DownOutlined,
  UpOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import {
  useDashboardSummaryQuery,
  useBestSellingProductsQuery,
  useRecentOrdersQuery,
  useLowStockProductsQuery,
} from "./hooks/useDashboard";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import {
  formatCurrency,
  formatNumber,
  formatDate,
} from "../../utils/formatters";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { data: summary, isLoading: summaryLoading } =
    useDashboardSummaryQuery();
  const { data: bestSellingProducts, isLoading: productsLoading } =
    useBestSellingProductsQuery(5);
  const { data: recentOrders, isLoading: ordersLoading } =
    useRecentOrdersQuery(5);
  const { data: lowStockProducts, isLoading: stockLoading } =
    useLowStockProductsQuery(5);

  // const kpiCards = [
  //   {
  //     title: "Total Revenue",
  //     value: summary?.totalRevenue || 0,
  //     formatter: formatCurrency,
  //     icon: <DollarCircleOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
  //     trend: "+12.5%",
  //     trendIcon: <UpOutlined />,
  //   },
  //   {
  //     title: "Total Orders",
  //     value: summary?.totalOrders || 0,
  //     formatter: formatNumber,
  //     icon: <ShoppingCartOutlined style={{ fontSize: 24, color: "#52c41a" }} />,
  //     trend: "+8.2%",
  //     trendIcon: <UpOutlined />,
  //   },
  //   {
  //     title: "Total Customers",
  //     value: summary?.totalCustomers || 0,
  //     formatter: formatNumber,
  //     icon: <TeamOutlined style={{ fontSize: 24, color: "#722ed1" }} />,
  //     trend: "+5.1%",
  //     trendIcon: <UpOutlined />,
  //   },
  //   {
  //     title: "Total Products",
  //     value: summary?.totalProducts || 0,
  //     formatter: formatNumber,
  //     icon: <BoxPlotOutlined style={{ fontSize: 24, color: "#fa8c16" }} />,
  //     trend: "+3.7%",
  //     trendIcon: <UpOutlined />,
  //   },
  //   {
  //     title: "Pending Orders",
  //     value: summary?.pendingOrders || 0,
  //     formatter: formatNumber,
  //     icon: <ClockCircleOutlined style={{ fontSize: 24, color: "#faad14" }} />,
  //     trend: "-2.1%",
  //     trendIcon: <DownOutlined />,
  //   },
  //   {
  //     title: "Low Stock Products",
  //     value: summary?.lowStockProducts || 0,
  //     formatter: formatNumber,
  //     icon: (
  //       <ExclamationCircleOutlined style={{ fontSize: 24, color: "#ff4d4f" }} />
  //     ),
  //     trend: "+1.3%",
  //     trendIcon: <UpOutlined />,
  //   },
  // ];

  const revenueData = [
    { name: "Mon", revenue: 12500, orders: 45 },
    { name: "Tue", revenue: 18200, orders: 52 },
    { name: "Wed", revenue: 15800, orders: 48 },
    { name: "Thu", revenue: 22100, orders: 65 },
    { name: "Fri", revenue: 28500, orders: 78 },
    { name: "Sat", revenue: 31200, orders: 92 },
    { name: "Sun", revenue: 19800, orders: 58 },
  ];

  const orderStatusOptions = (order: any) => [
    {
      label: "View",
      key: "view",
      icon: <EyeOutlined />,
      onClick: () => console.log("View", order),
    },
    {
      label: "Edit",
      key: "edit",
      icon: <EditOutlined />,
      onClick: () => console.log("Edit", order),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <PermissionGuard permission="DASHBOARD_READ">
          <Button type="primary" icon={<DollarCircleOutlined />}>
            Export Report
          </Button>
        </PermissionGuard>
      </div>

      {/* <Row gutter={[16, 16]} className={styles.kpiRow}>
        {kpiCards.map((card, index) => (
          <Col key={index} xs={24} sm={12} lg={8} xl={4}>
            <Card className={styles.kpiCard}>
              <Statistic
                title={card.title}
                value={card.value}
                formatter={card.formatter}
                prefix={card.icon}
                suffix={
                  <span className={styles.trend}>
                    {card.trendIcon} {card.trend}
                  </span>
                }
                valueStyle={styles.valueStyle}
              />
            </Card>
          </Col>
        ))}
      </Row> */}

      <Row gutter={[16, 16]} className={styles.chartRow}>
        <Col xs={24} lg={16}>
          <Card title="Revenue Overview" className={styles.chartCard}>
            <div className={styles.chart}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#8c8c8c" fontSize={12} />
                  <YAxis
                    stroke="#8c8c8c"
                    fontSize={12}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Revenue",
                    ]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #f0f0f0",
                      borderRadius: 8,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1890ff"
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Order Status" className={styles.chartCard}>
            <div className={styles.chart}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#8c8c8c" fontSize={12} />
                  <YAxis stroke="#8c8c8c" fontSize={12} />
                  <Tooltip
                    formatter={(value: number) => [
                      formatNumber(value),
                      "Orders",
                    ]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #f0f0f0",
                      borderRadius: 8,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#52c41a"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={styles.tableRow}>
        <Col xs={24} lg={12}>
          <Card title="Recent Orders" className={styles.tableCard}>
            <Table
              dataSource={recentOrders?.data || []}
              loading={ordersLoading}
              rowKey="_id"
              pagination={false}
              columns={[
                {
                  title: "Order #",
                  dataIndex: "orderNumber",
                  key: "orderNumber",
                  render: (text: string) => <strong>{text}</strong>,
                },
                {
                  title: "Customer",
                  dataIndex: "customerName",
                  key: "customerName",
                },
                {
                  title: "Total",
                  dataIndex: "total",
                  key: "total",
                  render: (text: number) => formatCurrency(text),
                },
                {
                  title: "Payment",
                  dataIndex: "paymentStatus",
                  key: "paymentStatus",
                  render: (status: string) => (
                    <Tag
                      color={
                        status === "PAID"
                          ? "success"
                          : status === "PENDING"
                            ? "warning"
                            : status === "FAILED"
                              ? "error"
                              : "default"
                      }
                    >
                      {status}
                    </Tag>
                  ),
                },
                {
                  title: "Status",
                  dataIndex: "orderStatus",
                  key: "orderStatus",
                  render: (status: string) => (
                    <Tag
                      color={
                        status === "DELIVERED"
                          ? "success"
                          : status === "SHIPPED"
                            ? "blue"
                            : status === "PROCESSING"
                              ? "cyan"
                              : status === "CANCELLED"
                                ? "error"
                                : "default"
                      }
                    >
                      {status}
                    </Tag>
                  ),
                },
                {
                  title: "Date",
                  dataIndex: "createdAt",
                  key: "createdAt",
                  render: (date: string) => formatDate(date),
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Low Stock Products" className={styles.tableCard}>
            <Table
              dataSource={lowStockProducts?.data || []}
              loading={stockLoading}
              rowKey="productId"
              pagination={false}
              columns={[
                {
                  title: "Product",
                  dataIndex: "productName",
                  key: "productName",
                },
                {
                  title: "SKU",
                  dataIndex: "sku",
                  key: "sku",
                },
                {
                  title: "Current Stock",
                  dataIndex: "currentStock",
                  key: "currentStock",
                  render: (stock: number) => (
                    <Tag color={stock <= 0 ? "error" : "warning"}>{stock}</Tag>
                  ),
                },
                {
                  title: "Threshold",
                  dataIndex: "threshold",
                  key: "threshold",
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
