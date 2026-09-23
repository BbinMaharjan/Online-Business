import { useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Modal,
  Form,
  message,
  Empty,
  Tree,
  Card,
  Row,
  Col,
  Dropdown,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  DownOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import {
  useCategoriesQuery,
  useDeleteCategoryMutation,
} from "./hooks/useCategories";
import { categoryApi } from "./api/categoryApi";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import { getStatusColor } from "../../utils/formatters";
import styles from "./CategoryListPage.module.css";

const { Option } = Select;

const CategoryListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    search: "",
    status: "",
  });
  const [treeData, setTreeData] = useState<any[]>([]);

  const { data, isLoading, refetch } = useCategoriesQuery(filters);
  const deleteMutation = useDeleteCategoryMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Category deleted successfully");
      refetch();
    } catch (error) {
      message.error("Failed to delete category");
    }
  };

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      width: 300,
      render: (_1: any, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
          <div className={styles.slug}>/{record.slug}</div>
        </div>
      ),
    },
    {
      title: "Parent",
      key: "parent",
      render: (_1: any, record: any) => record.parentId || "—",
    },
    {
      title: "Status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Sort Order",
      key: "sortOrder",
      width: 100,
    },
    {
      title: "Created",
      key: "createdAt",
      width: 160,
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      fixed: "right" as const,
      render: (_1: any, record: any) => (
        <Space>
          <PermissionGuard permission="categories:read">
            <Dropdown
              menu={{
                items: [
                  {
                    label: "View",
                    key: "view",
                    icon: <EyeOutlined />,
                    onClick: () => navigate(`/categories/${record._id}`),
                  },
                  {
                    label: "Edit",
                    key: "edit",
                    icon: <EditOutlined />,
                    onClick: () => navigate(`/categories/${record._id}/edit`),
                  },
                  { type: "divider" },
                  {
                    label: "Delete",
                    key: "delete",
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => handleDelete(record._id),
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
          <h1 className={styles.title}>Categories</h1>
          <p className={styles.subtitle}>Manage product categories</p>
        </div>
        <PermissionGuard permission="categories:create">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/categories/create")}
          >
            Create Category
          </Button>
        </PermissionGuard>
      </div>

      <Card className={styles.filterCard}>
        <Form layout="inline" className={styles.filterForm}>
          <Form.Item name="search">
            <Input
              placeholder="Search categories..."
              prefix={<SearchOutlined />}
              style={{ width: 280 }}
              onPressEnter={(e) => handleSearch(e.currentTarget.value)}
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

      <Row gutter={16}>
        <Col xs={24} lg={18}>
          <Card>
            <Table
              dataSource={data?.items || []}
              loading={isLoading}
              rowKey="_id"
              columns={columns}
              pagination={{
                current: data?.pagination?.page ?? 1,
                pageSize: data?.pagination?.limit ?? 50,
                total: data?.pagination?.total ?? 0,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                onChange: (page) => setFilters((prev) => ({ ...prev, page })),
                onShowSizeChange: (page, limit) =>
                  setFilters((prev) => ({ ...prev, page, limit })),
              }}
              scroll={{ x: 1000 }}
            />
            {!data?.items?.length && !isLoading && (
              <Empty description="No categories found" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card title="Category Tree">
            <Tree
              showLine
              defaultExpandAll
              treeData={treeData}
              onClick={(_, node) => navigate(`/categories/${node.key}/edit`)}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CategoryListPage;
