import { useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Form,
  Dropdown,
  Menu,
  Popconfirm,
  Empty,
  DatePicker,
  message,
} from "antd";
import {
  SearchOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import {
  useOrdersQuery,
  useUpdateOrderStatusMutation,
} from "./hooks/useOrders";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import {
  formatCurrency,
  getOrderStatusColor,
  getPaymentStatusColor,
} from "../../utils/formatters";
import styles from "./OrderListPage.module.css";

const OrderListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    paymentStatus: "",
    orderStatus: "",
  });

  const { data, isLoading, refetch } = useOrdersQuery(filters);
  const updateStatusMutation = useUpdateOrderStatusMutation();

  const statusOptions = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ];

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, orderStatus: status });
      message.success("Status updated");
      refetch();
    } catch {
      message.error("Failed to update");
    }
  };

  const columns = [
    {
      title: "Order #",
      key: "orderNumber",
      width: 140,
      render: (v: string) => <strong>{v}</strong>,
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, r: any) =>
        r.user ? (
          <div>
            <div style={{ fontWeight: 500 }}>
              {r.user.firstName} {r.user.lastName}
            </div>
            <div className={styles.small}>{r.user.email}</div>
          </div>
        ) : (
          r.userId
        ),
    },
    {
      title: "Items",
      key: "items",
      width: 100,
      render: (items: any[]) =>
        `${items.length} item${items.length > 1 ? "s" : ""}`,
    },
    {
      title: "Total",
      key: "total",
      width: 120,
      render: (v: number) => formatCurrency(v),
    },
    {
      title: "Payment",
      key: "paymentStatus",
      width: 120,
      render: (s: string) => <Tag color={getPaymentStatusColor(s)}>{s}</Tag>,
    },
    {
      title: "Order Status",
      key: "orderStatus",
      width: 140,
      render: (s: string) => <Tag color={getOrderStatusColor(s)}>{s}</Tag>,
    },
    { title: "Date", key: "createdAt", width: 180 },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      fixed: "right",
      render: (_, r: any) => (
        <Space>
          <PermissionGuard permission="ORDER_READ">
            <Dropdown
              menu={{
                items: [
                  {
                    label: "View",
                    key: "view",
                    icon: <EyeOutlined />,
                    onClick: () => navigate(`/orders/${r._id}`),
                  },
                  {
                    label: "Edit",
                    key: "edit",
                    icon: <EditOutlined />,
                    onClick: () => navigate(`/orders/${r._id}/edit`),
                  },
                  { type: "divider" },
                  ...statusOptions.map((st) => ({
                    label: st,
                    key: st,
                    onClick: () => handleStatusChange(r._id, st),
                  })),
                ],
              }}
            >
              <Button type="text" icon={<DownOutlined />} />
            </Dropdown>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Orders</h1>
          <p className={styles.subtitle}>Manage customer orders</p>
        </div>
      </div>
      <Card className={styles.filterCard}>
        <Form layout="inline" className={styles.filterForm}>
          <Form.Item name="search">
            <Input
              placeholder="Search orders..."
              prefix={<SearchOutlined />}
              style={{ width: 280 }}
              onPressEnter={(e) =>
                setFilters((p) => ({
                  ...p,
                  search: e.currentTarget.value,
                  page: 1,
                }))
              }
            />
          </Form.Item>
          <Form.Item name="paymentStatus">
            <Select
              placeholder="Payment"
              style={{ width: 140 }}
              options={[
                "PENDING",
                "PROCESSING",
                "PAID",
                "FAILED",
                "REFUNDED",
                "PARTIALLY_REFUNDED",
              ].map((v) => ({ value: v, label: v }))}
              allowClear
            />
          </Form.Item>
          <Form.Item name="orderStatus">
            <Select
              placeholder="Order"
              style={{ width: 160 }}
              options={[
                "PENDING",
                "CONFIRMED",
                "PROCESSING",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
                "REFUNDED",
              ].map((v) => ({ value: v, label: v }))}
              allowClear
            />
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Table
          dataSource={data?.items || []}
          loading={isLoading}
          rowKey="_id"
          columns={columns}
          pagination={{
            current: data?.pagination.page,
            pageSize: data?.pagination.limit,
            total: data?.pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: (page) => setFilters((p) => ({ ...p, page })),
            onShowSizeChange: (page, limit) =>
              setFilters((p) => ({ ...p, page, limit })),
          }}
          scroll={{ x: 1200 }}
        />
        {!data?.items?.length && !isLoading && (
          <Empty description="No orders found" />
        )}
      </Card>
    </div>
  );
};

import { Card } from "antd";

export default OrderListPage;
