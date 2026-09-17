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
  Rate,
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
  useReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} from "./hooks/useReviews";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import styles from "./ReviewListPage.module.css";

const ReviewListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    productId: "",
    status: "",
  });

  const { data, isLoading, refetch } = useReviewsQuery(filters);
  const updateMutation = useUpdateReviewStatusMutation();
  const deleteMutation = useDeleteReviewMutation();

  const handleStatusChange = async (
    reviewId: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    try {
      await updateMutation.mutateAsync({ reviewId, status });
      message.success("Review updated");
      refetch();
    } catch {
      message.error("Failed to update");
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteMutation.mutateAsync(reviewId);
      message.success("Review deleted");
      refetch();
    } catch {
      message.error("Failed to delete");
    }
  };

  const columns = [
    {
      title: "Product",
      key: "product",
      width: 200,
      render: (_1: any, r: any) => r.productId,
    },
    {
      title: "Customer",
      key: "customer",
      width: 160,
      render: (_1: any, r: any) =>
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
      title: "Rating",
      key: "rating",
      width: 100,
      render: (v: number) => (
        <Rate
          disabled
          value={v}
          count={5}
          tooltips={["Very Poor", "Poor", "Fair", "Good", "Excellent"]}
        />
      ),
    },
    { title: "Title", key: "title", render: (v: string) => v || "—" },
    {
      title: "Verified",
      key: "verifiedPurchase",
      width: 100,
      render: (v: boolean) => (
        <Tag color={v ? "success" : "default"}>{v ? "Yes" : "No"}</Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (s: string) => (
        <Tag
          color={
            s === "APPROVED"
              ? "success"
              : s === "REJECTED"
                ? "error"
                : "warning"
          }
        >
          {s}
        </Tag>
      ),
    },
    { title: "Date", key: "createdAt", width: 160 },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      fixed: "right" as const,
      render: (_1: any, r: any) => (
        <Space>
          <PermissionGuard permission="reviews:read">
            <Dropdown
              menu={{
                items: [
                  {
                    label: "View",
                    key: "view",
                    icon: <EyeOutlined />,
                    onClick: () => navigate(`/reviews/${r._id}`),
                  },
                  { type: "divider" },
                  {
                    label: "Approve",
                    key: "approve",
                    icon: <CheckCircleOutlined />,
                    onClick: () => handleStatusChange(r._id, "APPROVED"),
                  },
                  {
                    label: "Reject",
                    key: "reject",
                    icon: <CloseCircleOutlined />,
                    onClick: () => handleStatusChange(r._id, "REJECTED"),
                  },
                  { type: "divider" },
                  {
                    label: "Delete",
                    key: "delete",
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => handleDelete(r._id),
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
          <h1 className={styles.title}>Reviews</h1>
          <p className={styles.subtitle}>Moderate product reviews</p>
        </div>
      </div>
      <Card className={styles.filterCard}>
        <Form layout="inline" className={styles.filterForm}>
          <Form.Item name="productId">
            <Input
              placeholder="Product ID..."
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              onPressEnter={(e) =>
                setFilters((p) => ({
                  ...p,
                  productId: e.currentTarget.value,
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
                { value: "PENDING", label: "Pending" },
                { value: "APPROVED", label: "Approved" },
                { value: "REJECTED", label: "Rejected" },
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
          scroll={{ x: 1200 }}
        />
        {!data?.items?.length && !isLoading && (
          <Empty description="No reviews found" />
        )}
      </Card>
    </div>
  );
};

export default ReviewListPage;
