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
  Empty,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import {
  useCustomerQuery,
  useCustomerOrdersQuery,
  useUpdateCustomerStatusMutation,
} from "./hooks/useCustomers";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import { formatCurrency } from "../../utils/formatters";
import styles from "./CustomerDetailPage.module.css";

const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: customerResponse, isLoading, refetch } = useCustomerQuery(id || "");
  const customer = customerResponse?.data;
  const { data: ordersResponse } = useCustomerOrdersQuery(id || "");
  const orders = ordersResponse?.data;
  const updateStatusMutation = useUpdateCustomerStatusMutation();

  useEffect(() => {
    if (customer)
      dispatch(
        setBreadcrumbs([
          { label: "Customers", path: "/customers" },
          { label: `${customer.firstName} ${customer.lastName}` },
        ]),
      );
  }, [dispatch, customer]);

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: customer!._id, status });
      message.success("Status updated");
      refetch();
    } catch {
      message.error("Failed");
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (!customer)
    return <div className={styles.loading}>Customer not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/customers")}
        >
          Back
        </Button>
        <h1 className={styles.title}>
          {customer.firstName} {customer.lastName}
        </h1>
        <Space>
          <PermissionGuard permission="CUSTOMER_UPDATE">
            <Button
              type="primary"
              icon={
                customer.status === "ACTIVE" ? (
                  <CloseCircleOutlined />
                ) : (
                  <CheckCircleOutlined />
                )
              }
              onClick={() =>
                handleStatusChange(
                  customer.status === "ACTIVE" ? "BLOCKED" : "ACTIVE",
                )
              }
            >
              {customer.status === "ACTIVE" ? "Block" : "Activate"}
            </Button>
          </PermissionGuard>
        </Space>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card title="Profile">
            <Descriptions column={2}>
              <Descriptions.Item label="Email">
                {customer.email}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {customer.phone || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    customer.status === "ACTIVE"
                      ? "success"
                      : customer.status === "BLOCKED"
                        ? "error"
                        : "default"
                  }
                >
                  {customer.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Joined">
                {new Date(customer.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Login">
                {customer.lastLoginAt
                  ? new Date(customer.lastLoginAt).toLocaleString()
                  : "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Total Orders">
                {orders?.length || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Total Spent">
                {formatCurrency(
                  orders?.reduce((sum, o) => sum + o.total, 0) || 0,
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="Addresses">
            <Descriptions column={2}>
              <Descriptions.Item label="Shipping">
                {customer.addresses?.shipping?.addressLine1}
              </Descriptions.Item>
              <Descriptions.Item label="Billing">
                {customer.addresses?.billing?.addressLine1}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Card title="Recent Orders">
            <Table
              dataSource={orders?.slice(0, 5) || []}
              columns={[
                {
                  title: "Order",
                  dataIndex: "orderNumber",
                  key: "orderNumber",
                },
                {
                  title: "Total",
                  dataIndex: "total",
                  key: "total",
                  render: (v: number) => formatCurrency(v),
                },
                {
                  title: "Status",
                  dataIndex: "orderStatus",
                  key: "orderStatus",
                  render: (s: string) => (
                    <Tag
                      color={
                        s === "DELIVERED"
                          ? "success"
                          : s === "CANCELLED"
                            ? "error"
                            : "default"
                      }
                    >
                      {s}
                    </Tag>
                  ),
                },
                { title: "Date", dataIndex: "createdAt", key: "createdAt" },
              ]}
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Avatar">
            <Avatar size={128} src={customer.avatar} icon={<UserOutlined />}>
              {customer.firstName[0]}
              {customer.lastName[0]}
            </Avatar>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerDetailPage;
