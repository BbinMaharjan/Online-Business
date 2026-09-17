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
  Card,
} from "antd";
import {
  SearchOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import {
  useCustomersQuery,
  useUpdateCustomerStatusMutation,
  useBlockCustomerMutation,
} from "./hooks/useCustomers";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import styles from "./CustomerListPage.module.css";

const CustomerListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    status: "",
  });

  const { data, isLoading, refetch } = useCustomersQuery(filters);
  const updateStatusMutation = useUpdateCustomerStatusMutation();
  const blockMutation = useBlockCustomerMutation();

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      message.success("Status updated");
      refetch();
    } catch {
      message.error("Failed to update");
    }
  };

  const handleBlock = async (id: string) => {
    if (!window.confirm("Block this customer?")) return;
    try {
      await blockMutation.mutateAsync({ id, reason: "Manual block" });
      message.success("Customer blocked");
      refetch();
    } catch {
      message.error("Failed to block");
    }
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_1: any, r: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {r.firstName} {r.lastName}
          </div>
          <div className={styles.small}>{r.email}</div>
        </div>
      ),
    },
    {
      title: "Phone",
      key: "phone",
      width: 140,
      render: (v: string) => v || "—",
    },
    {
      title: "Orders",
      key: "orders",
      width: 80,
      render: (v: number) => v || 0,
    },
    {
      title: "Total Spent",
      key: "totalSpent",
      width: 140,
      render: (v: number) => `$${v?.toFixed(2) || "0.00"}`,
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (s: string) => (
        <Tag
          color={
            s === "ACTIVE" ? "success" : s === "BLOCKED" ? "error" : "default"
          }
        >
          {s}
        </Tag>
      ),
    },
    { title: "Joined", key: "createdAt", width: 180 },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      fixed: "right" as const,
      render: (_1: any, r: any) => (
        <Space>
          <PermissionGuard permission="customers:read">
            <Dropdown
              menu={{
                items: [
                  {
                    label: "View",
                    key: "view",
                    icon: <EyeOutlined />,
                    onClick: () => navigate(`/customers/${r._id}`),
                  },
                  {
                    label: "Edit",
                    key: "edit",
                    icon: <EditOutlined />,
                    onClick: () => navigate(`/customers/${r._id}/edit`),
                  },
                  { type: "divider" },
                  {
                    label: r.status === "ACTIVE" ? "Block" : "Activate",
                    key: "status",
                    icon:
                      r.status === "ACTIVE" ? (
                        <CloseCircleOutlined />
                      ) : (
                        <CheckCircleOutlined />
                      ),
                    onClick: () =>
                      handleStatusChange(
                        r._id,
                        r.status === "ACTIVE" ? "BLOCKED" : "ACTIVE",
                      ),
                  },
                  { type: "divider" },
                  {
                    label: "Delete",
                    key: "delete",
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => handleBlock(r._id),
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
          <h1 className={styles.title}>Customers</h1>
          <p className={styles.subtitle}>Manage customers</p>
        </div>
      </div>
      <Card className={styles.filterCard}>
        <Form layout="inline" className={styles.filterForm}>
          <Form.Item name="search">
            <Input
              placeholder="Search customers..."
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
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
                { value: "BLOCKED", label: "Blocked" },
              ]}
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
          scroll={{ x: 1000 }}
        />
        {!data?.items?.length && !isLoading && (
          <Empty description="No customers found" />
        )}
      </Card>
    </div>
  );
};

export default CustomerListPage;
