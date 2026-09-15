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
  DatePicker,
  message,
} from "antd";
import { SearchOutlined, DownOutlined, EyeOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import { useAuditLogsQuery } from "./hooks/useAuditLogs";
import styles from "./AuditLogPage.module.css";

const AuditLogPage = () => {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    adminId: "",
    action: "",
    resource: "",
  });

  const { data, isLoading, refetch } = useAuditLogsQuery(filters);

  const columns = [
    {
      title: "Admin",
      key: "admin",
      width: 180,
      render: (_, r: any) =>
        r.admin ? (
          <div>
            <div style={{ fontWeight: 500 }}>
              {r.admin.firstName} {r.admin.lastName}
            </div>
            <div className={styles.small}>{r.admin.email}</div>
          </div>
        ) : (
          r.adminId
        ),
    },
    {
      title: "Action",
      key: "action",
      width: 140,
      render: (v: string) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: "Resource",
      key: "resource",
      width: 140,
      render: (v: string) => <Tag>{v}</Tag>,
    },
    { title: "Resource ID", key: "resourceId", width: 140 },
    {
      title: "Details",
      key: "details",
      render: (v: any) => (
        <pre className={styles.details}>{JSON.stringify(v, null, 2)}</pre>
      ),
    },
    { title: "IP Address", key: "ipAddress", width: 140 },
    { title: "Date", key: "createdAt", width: 180 },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Audit Logs</h1>
          <p className={styles.subtitle}>View system activity logs</p>
        </div>
      </div>
      <Card className={styles.filterCard}>
        <Form layout="inline" className={styles.filterForm}>
          <Form.Item name="adminId">
            <Input
              placeholder="Admin ID..."
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              onPressEnter={(e) =>
                setFilters((p) => ({
                  ...p,
                  adminId: e.currentTarget.value,
                  page: 1,
                }))
              }
            />
          </Form.Item>
          <Form.Item name="action">
            <Input
              placeholder="Action..."
              style={{ width: 160 }}
              onPressEnter={(e) =>
                setFilters((p) => ({
                  ...p,
                  action: e.currentTarget.value,
                  page: 1,
                }))
              }
            />
          </Form.Item>
          <Form.Item name="resource">
            <Input
              placeholder="Resource..."
              style={{ width: 160 }}
              onPressEnter={(e) =>
                setFilters((p) => ({
                  ...p,
                  resource: e.currentTarget.value,
                  page: 1,
                }))
              }
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
          <Empty description="No audit logs" />
        )}
      </Card>
    </div>
  );
};

export default AuditLogPage;
