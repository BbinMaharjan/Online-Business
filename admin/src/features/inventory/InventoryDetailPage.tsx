import { useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  Divider,
  Button,
  Table,
  Empty,
  Statistic,
  Space,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  BoxPlotOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import {
  useInventoryByProductQuery,
  useAdjustStockMutation,
} from "./hooks/useInventory";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import { formatCurrency, getStatusColor } from "../../utils/formatters";
import styles from "./InventoryDetailPage.module.css";

const InventoryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: inventoryResponse, isLoading, refetch } = useInventoryByProductQuery(id || "");
  const inventory = inventoryResponse?.data;
  const adjustMutation = useAdjustStockMutation();

  useEffect(() => {
    if (inventory)
      dispatch(
        setBreadcrumbs([
          { label: "Inventory", path: "/inventory" },
          { label: "Product Inventory" },
        ]),
      );
  }, [dispatch, inventory]);

  const handleAdjust = async (record: any, type: "ADD" | "REMOVE" | "SET") => {
    const qty = parseInt(prompt(`Enter quantity to ${type}:`) || "0");
    if (!qty) return;
    try {
      await adjustMutation.mutateAsync({
        productId: record.productId,
        variantId: record.variantId,
        adjustmentType: type,
        quantity: qty,
        reason: "MANUAL_ADJUSTMENT",
      });
      message.success("Stock adjusted");
      refetch();
    } catch {
      message.error("Failed");
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (!inventory)
    return <div className={styles.loading}>Inventory not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/inventory")}
        >
          Back
        </Button>
        <h1 className={styles.title}>Product Inventory</h1>
      </div>
      <Row gutter={24}>
        {[
          <Col key="overview" xs={24} lg={12}>
            <Card title="Stock Overview">
              <Row gutter={16}>
                {[
                  {
                    title: "Total Stock",
                    value: inventory.quantity,
                    icon: (
                      <BoxPlotOutlined
                        style={{ color: "#1890ff", fontSize: 24 }}
                      />
                    ),
                  },
                  {
                    title: "Reserved",
                    value: inventory.reservedQuantity,
                    icon: (
                      <ShoppingOutlined
                        style={{ color: "#faad14", fontSize: 24 }}
                      />
                    ),
                  },
                  {
                    title: "Available",
                    value: inventory.quantity - inventory.reservedQuantity,
                    icon: (
                      <CheckCircleOutlined
                        style={{ color: "#52c41a", fontSize: 24 }}
                      />
                    ),
                  },
                  {
                    title: "Threshold",
                    value: inventory.lowStockThreshold,
                    icon: (
                      <ExclamationCircleOutlined
                        style={{ color: "#ff4d4f", fontSize: 24 }}
                      />
                    ),
                  },
                ].map((stat, index) => (
                  <Col key={index} xs={24} sm={6}>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      prefix={stat.icon}
                    />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>,
          <Col key="actions" xs={24} lg={12}>
            <Card title="Actions">
              <Space>
                <PermissionGuard permission="INVENTORY_UPDATE">
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => handleAdjust(inventory, "ADD")}
                  >
                    Add Stock
                  </Button>
                  <Button
                    danger
                    icon={<EditOutlined />}
                    onClick={() => handleAdjust(inventory, "REMOVE")}
                  >
                    Remove Stock
                  </Button>
                  <Button onClick={() => handleAdjust(inventory, "SET")}>
                    Set Stock
                  </Button>
                </PermissionGuard>
              </Space>
            </Card>
          </Col>,
        ]}
      </Row>
      <Card title="Variants">
        <Table
          dataSource={[]}
          columns={[
            {
              title: "Variant",
              dataIndex: "variant",
              key: "variant",
              render: (v: any) =>
                v ? (
                  <Tag>
                    {Object.entries(v.attributes)
                      .map(([k, val]) => `${k}:${val}`)
                      .join(", ")}
                  </Tag>
                ) : (
                  "—"
                ),
            },
            { title: "Stock", dataIndex: "stock", key: "stock" },
            {
              title: "Status",
              key: "status",
              render: (_, r: any) => (
                <Tag
                  color={
                    r.stock <= 0
                      ? "error"
                      : r.stock < inventory.lowStockThreshold
                        ? "warning"
                        : "success"
                  }
                >
                  {r.stock <= 0
                    ? "Out of Stock"
                    : r.stock < inventory.lowStockThreshold
                      ? "Low Stock"
                      : "In Stock"}
                </Tag>
              ),
            },
          ]}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default InventoryDetailPage;
