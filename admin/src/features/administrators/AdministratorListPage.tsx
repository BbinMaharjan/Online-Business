import { useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Form,
  Dropdown,
  Menu,
  Popconfirm,
  Empty,
  message,
  Modal,
  Card,
} from "antd";
import {
  SearchOutlined,
  DownOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  UserOutlined,
  LockOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import {
  useAdministratorsQuery,
  useCreateAdministratorMutation,
  useUpdateAdministratorMutation,
  useDeleteAdministratorMutation,
} from "./hooks/useAdministrators";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import { getStatusColor } from "../../utils/formatters";
import styles from "./AdministratorListPage.module.css";

const AdministratorListPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: "",
    status: "",
    role: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = useAdministratorsQuery(filters);
  const createMutation = useCreateAdministratorMutation();
  const updateMutation = useUpdateAdministratorMutation();
  const deleteMutation = useDeleteAdministratorMutation();

  const handleCreate = () => {
    setEditingAdmin(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (admin: any) => {
    setEditingAdmin(admin);
    form.setFieldsValue({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      status: admin.status,
      password: "",
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Admin deleted");
      refetch();
    } catch {
      message.error("Failed");
    }
  };

  const onFinish = async (values: any) => {
    try {
      if (editingAdmin) {
        await updateMutation.mutateAsync({
          id: editingAdmin._id,
          data: values,
        });
        message.success("Admin updated");
      } else {
        await createMutation.mutateAsync({
          ...values,
          password: values.password || "defaultPass123",
        });
        message.success("Admin created");
      }
      refetch();
      setModalVisible(false);
    } catch {
      message.error("Failed");
    }
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      width: 200,
      render: (_, r: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {r.firstName} {r.lastName}
          </div>
          <div className={styles.small}>{r.email}</div>
        </div>
      ),
    },
    {
      title: "Role",
      key: "role",
      width: 120,
      render: (v: string) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (s: string) => <Tag color={getStatusColor(s)}>{s}</Tag>,
    },
    { title: "Last Login", key: "lastLoginAt", width: 180 },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      fixed: "right",
      render: (_, r: any) => (
        <Space>
          <PermissionGuard permission="users:read">
            <Dropdown
              menu={{
                items: [
                  {
                    label: "View",
                    key: "view",
                    icon: <EyeOutlined />,
                    onClick: () => navigate(`/administrators/${r._id}`),
                  },
                  {
                    label: "Edit",
                    key: "edit",
                    icon: <EditOutlined />,
                    onClick: () => handleEdit(r),
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
          <h1 className={styles.title}>Administrators</h1>
          <p className={styles.subtitle}>Manage admin users</p>
        </div>
        <PermissionGuard permission="users:create">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Admin
          </Button>
        </PermissionGuard>
      </div>
      <Card className={styles.filterCard}>
        <Form layout="inline" className={styles.filterForm}>
          <Form.Item name="search">
            <Input
              placeholder="Search admins..."
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
              options={["ACTIVE", "INACTIVE", "BLOCKED"].map((v) => ({
                value: v,
                label: v,
              }))}
              allowClear
            />
          </Form.Item>
          <Form.Item name="role">
            <Select
              placeholder="Role"
              style={{ width: 140 }}
              options={["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"].map(
                (v) => ({ value: v, label: v }),
              )}
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
          <Empty description="No administrators" />
        )}
      </Card>

      <Modal
        title={editingAdmin ? "Edit Admin" : "Create Admin"}
        open={modalVisible}
        onOk={() => form.validateFields()}
        onCancel={() => setModalVisible(false)}
        form={form}
        width={600}
        onSubmit={onFinish}
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true }]}
        >
          <Input placeholder="First Name" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Last Name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true }, { type: "email" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input placeholder="Phone" />
        </Form.Item>
        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select
            options={["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"].map((v) => ({
              value: v,
              label: v,
            }))}
            placeholder="Select role"
          />
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select
            options={["ACTIVE", "INACTIVE", "BLOCKED"].map((v) => ({
              value: v,
              label: v,
            }))}
            placeholder="Select status"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label={editingAdmin ? "New Password (optional)" : "Password"}
          rules={editingAdmin ? [] : [{ required: true, min: 6 }]}
          valuePropName="value"
        >
          <Input.Password placeholder="Password" autoComplete="new-password" />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default AdministratorListPage;
