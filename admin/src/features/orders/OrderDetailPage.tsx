import { useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  Divider,
  Button,
  Table,
  Space,
  Descriptions,
  Avatar,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TruckOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import { useOrderQuery, useUpdateOrderStatusMutation } from "./hooks/useOrders";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import {
  formatCurrency,
  getOrderStatusColor,
  getPaymentStatusColor,
} from "../../utils/formatters";
import styles from "./OrderDetailPage.module.css";

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: order, isLoading } = useOrderQuery(id || "");
  const updateStatusMutation = useUpdateOrderStatusMutation();

  useEffect(() => {
    if (order)
      dispatch(
        setBreadcrumbs([
          { label: "Orders", path: "/orders" },
          { label: `Order ${order.orderNumber}` },
        ]),
      );
  }, [dispatch, order]);

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: order!._id,
        orderStatus: status,
      });
      message.success("Status updated");
      refetch();
    } catch {
      message.error("Failed");
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (!order) return <div className={styles.loading}>Order not found</div>;

  const statusOptions = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/orders")}
        >
          Back
        </Button>
        <h1 className={styles.title}>Order {order.orderNumber}</h1>
        <Space>
          <PermissionGuard permission="ORDER_UPDATE">
            <Dropdown
              menu={{
                items: statusOptions.map((s) => ({
                  label: s,
                  key: s,
                  onClick: () => handleStatusChange(s),
                })),
              }}
            >
              <Button type="primary" icon={<EditOutlined />}>
                Update Status
              </Button>
            </Dropdown>
          </PermissionGuard>
        </Space>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card title="Customer">
            <Descriptions column={2}>
              <Descriptions.Item label="Name">
                {order.user?.firstName} {order.user?.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {order.user?.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {order.user?.phone}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="Shipping Address">
            <Descriptions column={2}>
              <Descriptions.Item label="Name">
                {order.shippingAddress.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {order.shippingAddress.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {order.shippingAddress.addressLine1}{" "}
                {order.shippingAddress.addressLine2}
              </Descriptions.Item>
              <Descriptions.Item label="City">
                {order.shippingAddress.city}
              </Descriptions.Item>
              <Descriptions.Item label="State">
                {order.shippingAddress.state}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                {order.shippingAddress.country}
              </Descriptions.Item>
              <Descriptions.Item label="Postal Code">
                {order.shippingAddress.postalCode}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="Items">
            <Table
              dataSource={order.items}
              columns={[
                {
                  title: "Product",
                  dataIndex: "productName",
                  key: "productName",
                  render: (_, r: any) => (
                    <div>
                      <div style={{ fontWeight: 500 }}>{r.productName}</div>
                      <div className={styles.small}>{r.variant || r.sku}</div>
                    </div>
                  ),
                },
                {
                  title: "Price",
                  dataIndex: "price",
                  key: "price",
                  render: (v: number) => formatCurrency(v),
                },
                {
                  title: "Qty",
                  dataIndex: "quantity",
                  key: "quantity",
                  width: 80,
                },
                {
                  title: "Subtotal",
                  dataIndex: "subtotal",
                  key: "subtotal",
                  render: (v: number) => formatCurrency(v),
                },
              ]}
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Order Summary">
            <Descriptions column={1}>
              <Descriptions.Item label="Subtotal">
                {formatCurrency(order.subtotal)}
              </Descriptions.Item>
              <Descriptions.Item label="Discount">
                {formatCurrency(order.discount)}
              </Descriptions.Item>
              <Descriptions.Item label="Tax">
                {formatCurrency(order.tax)}
              </Descriptions.Item>
              <Descriptions.Item label="Shipping">
                {formatCurrency(order.shippingFee)}
              </Descriptions.Item>
              <Descriptions.Item
                label="Total"
                style={{ fontSize: 18, fontWeight: 600, color: "#1890ff" }}
              >
                {formatCurrency(order.total)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="Payment">
            <Descriptions column={1}>
              <Descriptions.Item label="Status">
                <Tag color={getPaymentStatusColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Method">
                {order.paymentMethod || "—"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="Order Status">
            <Descriptions column={1}>
              <Descriptions.Item label="Status">
                <Tag color={getOrderStatusColor(order.orderStatus)}>
                  {order.orderStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {new Date(order.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailPage;
