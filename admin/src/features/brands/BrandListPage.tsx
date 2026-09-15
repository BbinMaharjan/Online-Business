import { useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Dropdown,
  Menu,
  Modal,
  Form,
  message,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import { useBrandsQuery, useDeleteBrandMutation } from "./hooks/useBrands";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import { getStatusColor } from "../../utils/formatters";
import styles from "./BrandListPage.module.css";

const BrandListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    status: "",
  });

  const { data, isLoading, refetch } = useBrandsQuery(filters);
  const deleteMutation = useDeleteBrandMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Brand deleted successfully");
      refetch();
    } catch (error) {
      message.error("Failed to delete brand");
    }
  };

  const columns = [
    {
      title: "Logo",
      key: "logo",
      width: 60,
      render: (_, r: any) =>
        r.logo ? (
          <img
            src={r.logo}
            alt={r.name}
            style={{ width: 40, height: 40, borderRadius: 4 }}
          />
        ) : (
          "—"
        ),
    },
    {
      title: "Name",
      key: "name",
      render: (_, r: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{r.name}</div>
          <div className={styles.slug}>/{r.slug}</div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 100,
      render: (s: string) => <Tag color={getStatusColor(s)}>{s}</Tag>,
    },
    { title: "Created", key: "createdAt", width: 160 },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      fixed: "right",
      render: (_, r: any) => (
        <Space>
          <PermissionGuard permission="BRAND_READ">
            <Dropdown
              menu={{
                items: [
                  {
                    label: "View",
                    key: "view",
                    icon: <EyeOutlined />,
                    onClick: () => navigate(`/brands/${r._id}`),
                  },
                  {
                    label: "Edit",
                    key: "edit",
                    icon: <EditOutlined />,
                    onClick: () => navigate(`/brands/${r._id}/edit`),
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
          <h1 className={styles.title}>Brands</h1>
          <p className={styles.subtitle}>Manage product brands</p>
        </div>
        <PermissionGuard permission="BRAND_CREATE">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/brands/create")}
          >
            Create Brand
          </Button>
        </PermissionGuard>
      </div>
      <Card className={styles.filterCard}>
        <Form layout="inline" className={styles.filterForm}>
          <Form.Item name="search">
            <Input
              placeholder="Search brands..."
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
          <Empty description="No brands found" />
        )}
      </Card>
    </div>
  );
};

import { SearchOutlined } from "@ant-design/icons";
import { Card } from "antd";

export default BrandListPage;
