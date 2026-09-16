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
  message,
  DatePicker,
  Card,
} from "antd";
import {
  SearchOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import {
  usePaymentsQuery,
  useRefundPaymentMutation,
} from "./hooks/usePayments";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import { formatCurrency, getPaymentStatusColor } from "../../utils/formatters";
import styles from "./PaymentListPage.module.css";

const PaymentListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    status: "",
    provider: "",
  });

  const { data, isLoading, refetch } = usePaymentsQuery(filters);
  const refundMutation = useRefundPaymentMutation();

  const handleRefund = async (paymentId: string) => {
    const amount = parseFloat(prompt("Enter refund amount:") || "0");
    if (!amount) return;
    try {
      await refundMutation.mutateAsync({ paymentId, amount });
      message.success("Refund processed");
      refetch();
    } catch {
      message.error("Failed to process refund");
    }
  };

  const columns = [
    {
      title: "Transaction ID",
      key: "transactionId",
      width: 180,
      render: (v: string) => <strong>{v}</strong>,
    },
    {
      title: "Order",
      key: "order",
      width: 140,
      render: (_, r: any) => r.orderId,
    },
    {
      title: "Customer",
      key: "customer",
      width: 160,
      render: (_, r: any) => r.userId,
    },
    { title: "Provider", key: "provider", width: 120 },
    {
      title: "Amount",
      key: "amount",
      width: 120,
      render: (v: number) => formatCurrency(v),
    },
    { title: "Method", key: "paymentMethod", width: 140 },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (s: string) => <Tag color={getPaymentStatusColor(s)}>{s}</Tag>,
    },
    { title: "Date", key: "createdAt", width: 180 },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      fixed: "right",
      render: (_, r: any) => (
        <Space>
          <PermissionGuard permission="payments:read">
            <Dropdown
              menu={{
                items: [
                  {
                    label: "View",
                    key: "view",
                    icon: <EyeOutlined />,
                    onClick: () => navigate(`/payments/${r._id}`),
                  },
                  { type: "divider" },
                  {
                    label: "Refund",
                    key: "refund",
                    icon: <WalletOutlined />,
                    onClick: () => handleRefund(r._id),
                  },
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
          <h1 className={styles.title}>Payments</h1>
          <p className={styles.subtitle}>Manage payment transactions</p>
        </div>
      </div>
      <Card className={styles.filterCard}>
        <Form layout="inline" className={styles.filterForm}>
          <Form.Item name="search">
            <Input
              placeholder="Search payments..."
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
          <Form.Item name="status">
            <Select
              placeholder="Status"
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
          <Form.Item name="provider">
            <Input
              placeholder="Provider"
              style={{ width: 140 }}
              onPressEnter={(e) =>
                setFilters((p) => ({
                  ...p,
                  provider: e.currentTarget.value,
                  page: 1,
                }))
              }
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
          <Empty description="No payments found" />
        )}
      </Card>
    </div>
  );
};

export default PaymentListPage;
