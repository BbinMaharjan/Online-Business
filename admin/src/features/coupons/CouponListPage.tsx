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
} from "antd";
import {
  SearchOutlined,
  DownOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import { useCouponsQuery, useDeleteCouponMutation } from "./hooks/useCoupons";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import { getStatusColor } from "../../utils/formatters";
import styles from "./CouponListPage.module.css";

const CouponListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    status: "",
  });

  const { data, isLoading, refetch } = useCouponsQuery(filters);
  const deleteMutation = useDeleteCouponMutation();

  const handleDelete = async (code: string) => {
    try {
      await deleteMutation.mutateAsync(code);
      message.success("Coupon deleted");
      refetch();
    } catch {
      message.error("Failed to delete");
    }
  };

  const columns = [
    {
      title: "Code",
      key: "code",
      width: 140,
      render: (v: string) => <strong>{v}</strong>,
    },
    {
      title: "Description",
      key: "description",
      render: (v: string) => v || "—",
    },
    {
      title: "Type",
      key: "discountType",
      width: 120,
      render: (t: string) => <Tag>{t}</Tag>,
    },
    {
      title: "Value",
      key: "discountValue",
      width: 100,
      render: (v: number, r: any) =>
        r.discountType === "PERCENTAGE" ? `${v}%` : `$${v}`,
    },
    {
      title: "Min Order",
      key: "minimumOrder",
      width: 100,
      render: (v: number) => (v ? `$${v}` : "—"),
    },
    {
      title: "Usage",
      key: "usage",
      width: 120,
      render: (_, r: any) => `${r.usedCount}/${r.usageLimit}`,
    },
    {
      title: "Valid",
      key: "validity",
      width: 200,
      render: (_, r: any) =>
        `${new Date(r.startDate).toLocaleDateString()} - ${new Date(r.endDate).toLocaleDateString()}`,
    },
    {
      title: "Status",
      key: "status",
      width: 100,
      render: (s: string) => <Tag color={getStatusColor(s)}>{s}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      fixed: "right",
      render: (_, r: any) => (
        <Space>
          <PermissionGuard permission="coupons:read">
            <Dropdown
              menu={{
                items: [
                  {
                    label: "View",
                    key: "view",
                    icon: <EyeOutlined />,
                    onClick: () => navigate(`/coupons/${r.code}`),
                  },
                  {
                    label: "Edit",
                    key: "edit",
                    icon: <EditOutlined />,
                    onClick: () => navigate(`/coupons/${r.code}/edit`),
                  },
                  { type: "divider" },
                  {
                    label: "Delete",
                    key: "delete",
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => handleDelete(r.code),
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
          <h1 className={styles.title}>Coupons</h1>
          <p className={styles.subtitle}>Manage discount coupons</p>
        </div>
        <PermissionGuard permission="coupons:create">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/coupons/create")}
          >
            Create Coupon
          </Button>
        </PermissionGuard>
      </div>
      <Card className={styles.filterCard}>
        <Form layout="inline" className={styles.filterForm}>
          <Form.Item name="search">
            <Input
              placeholder="Search coupons..."
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
                { value: "EXPIRED", label: "Expired" },
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
          rowKey="code"
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
          <Empty description="No coupons found" />
        )}
      </Card>
    </div>
  );
};

import { Card } from "antd";

export default CouponListPage;
