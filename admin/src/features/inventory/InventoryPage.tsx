import { useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Form,
  message,
  Empty,
  Popconfirm,
  Card,
  Switch,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  DownOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import {
  useInventoryQuery,
  useAdjustStockMutation,
} from "./hooks/useInventory";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import { getStatusColor } from "../../utils/formatters";
import styles from "./InventoryPage.module.css";

const InventoryPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    lowStock: false,
  });

  const { data, isLoading, refetch } = useInventoryQuery(filters);
  const adjustMutation = useAdjustStockMutation();

  const handleAdjust = async (record: any, type: "ADD" | "REMOVE" | "SET") => {
    const quantity = parseInt(prompt(`Enter quantity to ${type}:`) || "0");
    if (!quantity) return;
    try {
      await adjustMutation.mutateAsync({
        productId: record.productId,
        variantId: record.variantId,
        adjustmentType: type,
        quantity,
        reason: "MANUAL_ADJUSTMENT",
      });
      message.success("Stock adjusted");
      refetch();
    } catch {
      message.error("Failed to adjust");
    }
  };

  const columns = [
    {
      title: "Product",
      key: "product",
      render: (_, r: any) =>
        r.product ? (
          <div>
            <div style={{ fontWeight: 500 }}>{r.product.name}</div>
            <div className={styles.sku}>{r.product.sku}</div>
          </div>
        ) : (
          "—"
        ),
    },
    {
      title: "Variant",
      key: "variant",
      render: (_, r: any) =>
        r.variant ? (
          <Tag>
            {Object.entries(r.variant.attributes)
              .map(([k, v]) => `${k}:${v}`)
              .join(", ")}
          </Tag>
        ) : (
          "—"
        ),
    },
    {
      title: "Stock",
      key: "quantity",
      width: 100,
      render: (q: number) => <strong>{q}</strong>,
    },
    { title: "Reserved", key: "reservedQuantity", width: 100 },
    {
      title: "Available",
      key: "available",
      width: 100,
      render: (_, r: any) => (
        <Tag
          color={
            r.quantity - r.reservedQuantity < r.lowStockThreshold
              ? "warning"
              : "success"
          }
        >
          {r.quantity - r.reservedQuantity}
        </Tag>
      ),
    },
    { title: "Threshold", key: "lowStockThreshold", width: 100 },
    {
      title: "Status",
      key: "status",
      width: 100,
      render: (_, r: any) => {
        const available = r.quantity - r.reservedQuantity;
        return (
          <Tag
            color={
              available <= 0
                ? "error"
                : available < r.lowStockThreshold
                  ? "warning"
                  : "success"
            }
          >
            {available <= 0
              ? "Out of Stock"
              : available < r.lowStockThreshold
                ? "Low Stock"
                : "In Stock"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      fixed: "right",
      render: (_, r: any) => (
        <Space>
          <PermissionGuard permission="inventory:update">
            <Button
              type="link"
              icon={<PlusOutlined />}
              onClick={() => handleAdjust(r, "ADD")}
            >
              Add
            </Button>
            <Button
              type="link"
              danger
              icon={<EditOutlined />}
              onClick={() => handleAdjust(r, "REMOVE")}
            >
              Remove
            </Button>
            <Button type="link" onClick={() => handleAdjust(r, "SET")}>
              Set
            </Button>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Inventory</h1>
          <p className={styles.subtitle}>Manage product inventory</p>
        </div>
      </div>
      <Card className={styles.filterCard}>
        <Form layout="inline" className={styles.filterForm}>
          <Form.Item name="search">
            <Input
              placeholder="Search products..."
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
          <Form.Item name="lowStock" valuePropName="checked">
            <Switch>Low Stock Only</Switch>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        {data ? (
          <>
            <Table
              dataSource={data.items}
              loading={isLoading}
              rowKey="productId"
              columns={columns}
              pagination={{
                current: data.pagination.page,
                pageSize: data.pagination.limit,
                total: data.pagination.total,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                onChange: (page) => setFilters((p) => ({ ...p, page })),
                onShowSizeChange: (page, limit) =>
                  setFilters((p) => ({ ...p, page, limit })),
              }}
              scroll={{ x: 1200 }}
            />
            {!data.items.length && !isLoading && (
              <Empty description="No inventory records" />
            )}
          </>
        ) : (
          <Table
            dataSource={[]}
            loading={isLoading}
            rowKey="productId"
            columns={columns}
            pagination={false}
            scroll={{ x: 1200 }}
          />
        )}
      </Card>
    </div>
  );
};

export default InventoryPage;
