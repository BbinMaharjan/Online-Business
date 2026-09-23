import { useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Form,
  Empty,
  message,
  Card,
} from "antd";
import {
  SearchOutlined,
  DownOutlined,
  BellOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import {
  useNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "./hooks/useNotifications";
import { useAppSelector } from "../../store/hooks";
import styles from "./NotificationPage.module.css";

const NotificationPage = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.admin?._id);
  const [filters, setFilters] = useState({ page: 1, limit: 20 });
  const { data, isLoading, refetch } = useNotificationsQuery(
    userId || "",
    filters.page,
    filters.limit,
  );
  const markReadMutation = useMarkAsReadMutation();
  const markAllReadMutation = useMarkAllAsReadMutation();

  const handleMarkRead = async (notificationId: string) => {
    try {
      await markReadMutation.mutateAsync({ userId: userId!, notificationId });
      refetch();
    } catch {
      message.error("Failed");
    }
  };

  const columns = [
    {
      title: "Type",
      key: "type",
      width: 180,
      render: (v: string) => <Tag>{v}</Tag>,
    },
    {
      title: "Title",
      key: "title",
      render: (v: string) => <strong>{v}</strong>,
    },
    { title: "Message", key: "message" },
    {
      title: "Status",
      key: "isRead",
      width: 100,
      render: (v: boolean) => (
        <Tag color={v ? "success" : "warning"}>{v ? "Read" : "Unread"}</Tag>
      ),
    },
    { title: "Date", key: "createdAt", width: 180 },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right" as const,
      render: (_1: any, r: any) => (
        <Space>
          {!r.isRead && (
            <Button
              type="text"
              size="small"
              onClick={() => handleMarkRead(r._id)}
            >
              Mark Read
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Notifications</h1>
          <p className={styles.subtitle}>Manage your notifications</p>
        </div>
        <Space>
          <Button onClick={() => markAllReadMutation.mutate(userId!)}>
            Mark All Read
          </Button>
        </Space>
      </div>
      <Card>
        <Table
          dataSource={data?.items || []}
          loading={isLoading}
          rowKey="_id"
          columns={columns}
          pagination={{
            current: data?.pagination?.page ?? 1,
            pageSize: data?.pagination?.limit ?? 20,
            total: data?.pagination?.total ?? 0,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: (page) => setFilters((p) => ({ ...p, page })),
          }}
          scroll={{ x: 1000 }}
        />
        {!data?.items?.length && !isLoading && (
          <Empty description="No notifications" />
        )}
      </Card>
    </div>
  );
};

export default NotificationPage;
