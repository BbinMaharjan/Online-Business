import { useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Form,
  Card,
  Empty,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import { useShippingMethodsQuery } from "./hooks/useShipping";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import { getStatusColor } from "../../utils/formatters";
import styles from "./ShippingPage.module.css";

const ShippingPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, isLoading } = useShippingMethodsQuery();

  const columns = [
    {
      title: "Name",
      key: "name",
      width: 180,
      render: (_, r: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{r.name}</div>
          <div className={styles.small}>{r.description || "—"}</div>
        </div>
      ),
    },
    {
      title: "Price",
      key: "price",
      width: 100,
      render: (v: number) => `$${v.toFixed(2)}`,
    },
    { title: "Est. Delivery", key: "estimatedDelivery", width: 140 },
    {
      title: "Zones",
      key: "zones",
      width: 200,
      render: (z: string[]) => z?.join(", ") || "—",
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
          <PermissionGuard permission="shipping:read">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/shipping/${r._id}`)}
            >
              View
            </Button>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => navigate(`/shipping/${r._id}/edit`)}
            >
              Edit
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
          <h1 className={styles.title}>Shipping Methods</h1>
          <p className={styles.subtitle}>Manage shipping options</p>
        </div>
        <PermissionGuard permission="shipping:create">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/shipping/create")}
          >
            Add Method
          </Button>
        </PermissionGuard>
      </div>
      <Card>
        <Table
          dataSource={data || []}
          loading={isLoading}
          rowKey="_id"
          columns={columns}
          pagination={false}
          scroll={{ x: 1000 }}
        />
        {!data?.length && !isLoading && (
          <Empty description="No shipping methods" />
        )}
      </Card>
    </div>
  );
};

export default ShippingPage;
