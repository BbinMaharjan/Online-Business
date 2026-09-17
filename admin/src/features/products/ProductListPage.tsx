import { useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Dropdown,
  Modal,
  Form,
  message,
  Empty,
  Spin,
  Card,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  CopyOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import {
  useProductsQuery,
  useDeleteProductMutation,
} from "./hooks/useProducts";
import { productApi } from "./api/productApi";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import {
  formatCurrency,
  getStatusColor,
  truncate,
} from "../../utils/formatters";
import styles from "./ProductListPage.module.css";

const { Option } = Select;

const statusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
];

const ProductListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    categoryId: "",
    brandId: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  const { data, isLoading, refetch } = useProductsQuery(filters);
  const deleteMutation = useDeleteProductMutation();

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (page: number, limit: number) => {
    setFilters((prev) => ({ ...prev, page, limit }));
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Product deleted successfully");
      refetch();
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  const handleDuplicate = async (product: any) => {
    try {
      setLoading(true);
      const { name, ...rest } = product;
      await productApi.createProduct({
        ...rest,
        name: `${name} (Copy)`,
        sku: `${product.sku}-COPY-${Date.now()}`,
        slug: `${product.slug}-copy-${Date.now()}`,
      });
      message.success("Product duplicated successfully");
      refetch();
    } catch (error) {
      message.error("Failed to duplicate product");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (product: any, newStatus: string) => {
    try {
      await productApi.updateProduct(product._id, { status: newStatus as "ACTIVE" | "INACTIVE" | "DRAFT" | "ARCHIVED" });
      message.success("Product status updated");
      refetch();
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const columns = [
    {
      title: "Image",
      key: "images",
      width: 60,
      render: (_: any, record: any) => (
        <img
          src={record.images?.[0] || "/placeholder.png"}
          alt={record.name}
          className={styles.productImage}
        />
      ),
    },
    {
      title: "Name",
      key: "name",
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
          <div className={styles.sku}>{record.sku}</div>
        </div>
      ),
    },
    {
      title: "Category",
      key: "category",
      render: (_: any, record: any) => record.categoryId,
    },
    {
      title: "Brand",
      key: "brand",
      render: (_: any, record: any) => record.brandId,
    },
    {
      title: "Price",
      key: "price",
      width: 100,
      render: (_: any, record: any) => formatCurrency(record.price),
    },
    {
      title: "Stock",
      key: "stock",
      width: 100,
      render: (_: any, record: any) => {
        const totalStock =
          record.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) ||
          0;
        return totalStock > 0 ? (
          <Tag color={totalStock < 10 ? "warning" : "success"}>
            {totalStock}
          </Tag>
        ) : (
          <Tag color="error">Out of Stock</Tag>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      width: 100,
      render: (_: any, record: any) => (
        <Tag color={getStatusColor(record.status)}>{record.status}</Tag>
      ),
    },
    {
      title: "Created",
      key: "createdAt",
      width: 160,
      render: (_: any, record: any) => truncate(record.createdAt, 16),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <Space>
          <PermissionGuard permission="products:read">
            <Dropdown
              menu={{
                items: [
                  {
                    label: "View",
                    key: "view",
                    icon: <EyeOutlined />,
                    onClick: () => navigate(`/products/${record._id}`),
                  },
                  {
                    label: "Edit",
                    key: "edit",
                    icon: <EditOutlined />,
                    onClick: () => navigate(`/products/${record._id}/edit`),
                  },
                  {
                    label: "Duplicate",
                    key: "duplicate",
                    icon: <CopyOutlined />,
                    onClick: () => handleDuplicate(record),
                  },
                  {
                    label:
                      record.status === "ACTIVE" ? "Unpublish" : "Publish",
                    key: "publish",
                    icon:
                      record.status === "ACTIVE" ? (
                        <CloseCircleOutlined />
                      ) : (
                        <CheckCircleOutlined />
                      ),
                    onClick: () =>
                      handleStatusChange(
                        record,
                        record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                      ),
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
          <h1 className={styles.title}>Products</h1>
          <p className={styles.subtitle}>Manage your product catalog</p>
        </div>
        <PermissionGuard permission="products:create">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/products/create")}
          >
            Create Product
          </Button>
        </PermissionGuard>
      </div>

      <Card className={styles.filterCard}>
        <Space wrap>
          <Input
            placeholder="Search products..."
            prefix={<SearchOutlined />}
            style={{ width: 280 }}
            onPressEnter={(e) => handleSearch(e.currentTarget.value)}
            allowClear
          />
          <Select
            placeholder="Status"
            style={{ width: 140 }}
            options={statusOptions}
            allowClear
            onChange={(value) => handleFilterChange("status", value || "")}
          />
          <Select
            placeholder="Category"
            style={{ width: 160 }}
            allowClear
            onChange={(value) => handleFilterChange("categoryId", value || "")}
            options={[]}
          />
          <Select
            placeholder="Brand"
            style={{ width: 160 }}
            allowClear
            onChange={(value) => handleFilterChange("brandId", value || "")}
            options={[]}
          />
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Refresh
          </Button>
        </Space>
      </Card>

      <div className={styles.tableWrapper}>
        <Table
          dataSource={data?.items}
          loading={isLoading}
          rowKey="_id"
          columns={columns}
          pagination={{
            current: data?.pagination?.page || 1,
            pageSize: data?.pagination?.limit || 20,
            total: data?.pagination?.total || 0,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: handlePageChange,
            onShowSizeChange: handlePageSizeChange,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} products`,
          }}
          scroll={{ x: 1200 }}
        />
      </div>
    </div>
  );
};

export default ProductListPage;
