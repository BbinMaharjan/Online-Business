import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  message,
  Card,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import { useBannersQuery, useDeleteBannerMutation } from "./hooks/useBanners";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import styles from "./BannerListPage.module.css";

const BannerListPage = () => {
  const dispatch = useAppDispatch();
  const deleteMutation = useDeleteBannerMutation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, refetch } = useBannersQuery({
    page,
    limit: pageSize,
    search,
    status,
    sortBy: "sortOrder",
    sortOrder: "asc",
  });

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (image: string) => (
        <img
          src={image}
          alt="Banner"
          style={{ width: 80, height: 40, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) =>
        text?.substring(0, 50) + (text?.length > 50 ? "..." : ""),
    },
    {
      title: "Button",
      dataIndex: "buttonText",
      key: "buttonText",
      render: (text: string) => text || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "success" : "default"}>{status}</Tag>
      ),
    },
    {
      title: "Sort Order",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 100,
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_: any, record: any) => (
        <Space>
          <PermissionGuard permission="banners:update" fallback={null}>
            <Link to={`/banners/${record._id}/edit`}>
              <Button>
                <EditOutlined />
              </Button>
            </Link>
          </PermissionGuard>
          <PermissionGuard permission="banners:delete" fallback={null}>
            <Button danger onClick={() => handleDelete(record._id)}>
              <DeleteOutlined />
            </Button>
          </PermissionGuard>
        </Space>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      message.success("Banner deleted");
      refetch();
    } catch {
      message.error("Failed to delete banner");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Banners</h1>
          <p className={styles.subtitle}>Manage store banners</p>
        </div>
        <PermissionGuard permission="banners:create" fallback={null}>
          <Link to="/banners/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Add Banner
            </Button>
          </Link>
        </PermissionGuard>
      </div>
      <Card className={styles.filterCard}>
        <Row gutter={16} align="bottom">
          <Col xs={24} sm={8}>
            <Input
              placeholder="Search by title..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={6}>
            <Select
              placeholder="Filter by status"
              value={status}
              onChange={handleStatusChange}
              allowClear
              options={[
                { value: "ACTIVE", label: "Active" },
                { value: "INACTIVE", label: "Inactive" },
              ]}
            />
          </Col>
        </Row>
      </Card>
      <Card>
        {isLoading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={data?.items || []}
              pagination={{
                current: page,
                pageSize: pageSize,
                total: data?.pagination.total || 0,
                onChange: handleTableChange,
                showSizeChanger: true,
              }}
              rowKey="_id"
              loading={isLoading}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default BannerListPage;
