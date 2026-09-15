import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Empty,
  Modal,
  Form,
  message,
  Row,
  Col,
  Select,
  Input,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import { useRolesQuery, usePermissionsQuery } from "./hooks/useAdministrators";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import styles from "./RolesPage.module.css";

const RolesPage = () => {
  const dispatch = useAppDispatch();
  const { data: roles, isLoading: rolesLoading } = useRolesQuery();
  const { data: permissions, isLoading: permLoading } = usePermissionsQuery();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [form] = Form.useForm();

  const handleCreate = () => {
    setEditingRole(null);
    form.resetFields();
    setModalVisible(true);
  };
  const handleEdit = (role: any) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setModalVisible(true);
  };
  const onFinish = async (values: any) => {
    message.success(editingRole ? "Role updated" : "Role created");
    setModalVisible(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Roles & Permissions</h1>
          <p className={styles.subtitle}>Manage access control</p>
        </div>
        <PermissionGuard permission="ROLE_CREATE">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Create Role
          </Button>
        </PermissionGuard>
      </div>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Roles">
            <Table
              dataSource={roles || []}
              loading={rolesLoading}
              columns={[
                { title: "Name", dataIndex: "name", key: "name" },
                {
                  title: "Description",
                  dataIndex: "description",
                  key: "description",
                },
                {
                  title: "Permissions",
                  key: "permissions",
                  render: (p: string[]) => (
                    <Space>
                      {p.map((perm) => (
                        <Tag key={perm} color="blue">
                          {perm}
                        </Tag>
                      ))}
                    </Space>
                  ),
                },
                {
                  title: "Actions",
                  key: "actions",
                  render: (_, r: any) => (
                    <Space>
                      <PermissionGuard permission="ROLE_READ">
                        <Button
                          type="link"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(r)}
                        >
                          Edit
                        </Button>
                      </PermissionGuard>
                    </Space>
                  ),
                },
              ]}
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Available Permissions">
            <div className={styles.permGrid}>
              {permissions?.items?.map((p: any) => (
                <Tag key={p.key} color="geekblue">
                  {p.name} ({p.key})
                </Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
      <Modal
        title={editingRole ? "Edit Role" : "Create Role"}
        open={modalVisible}
        onOk={() => form.validateFields()}
        onCancel={() => setModalVisible(false)}
        form={form}
        onSubmit={onFinish}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Role name" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Description" rows={3} />
        </Form.Item>
        <Form.Item name="permissions" label="Permissions">
          <Select
            mode="multiple"
            placeholder="Select permissions"
            options={
              permissions?.items?.map((p: any) => ({
                value: p.key,
                label: p.name,
              })) || []
            }
          />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default RolesPage;
