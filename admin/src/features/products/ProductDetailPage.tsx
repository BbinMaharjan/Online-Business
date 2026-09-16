import { useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Image,
  Tag,
  Divider,
  Space,
  Button,
  Empty,
} from "antd";
import {
  EditOutlined,
  ArrowLeftOutlined,
  ImageOutlined,
  ShoppingOutlined,
  TagOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import { useProductQuery } from "./hooks/useProducts";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import { formatCurrency, getStatusColor } from "../../utils/formatters";
import styles from "./ProductDetailPage.module.css";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: productResponse, isLoading } = useProductQuery(id || "");
  const product = productResponse?.data;

  useEffect(() => {
    if (product) {
      dispatch(
        setBreadcrumbs([
          { label: "Products", path: "/products" },
          { label: product.name },
        ]),
      );
    }
  }, [dispatch, product]);

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (!product) return <div className={styles.loading}>Product not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/products")}
        >
          Back
        </Button>
        <h1 className={styles.title}>{product.name}</h1>
        <Space>
          <PermissionGuard permission="PRODUCT_UPDATE">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/products/${product._id}/edit`)}
            >
              Edit Product
            </Button>
          </PermissionGuard>
        </Space>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          <Card>
            <div className={styles.imageSection}>
              {product.images?.length ? (
                <Image.PreviewGroup>
                  {product.images.map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      width={200}
                    />
                  ))}
                </Image.PreviewGroup>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No images"
                />
              )}
            </div>
          </Card>

          {product.variants?.length && (
            <Card title="Variants">
              <Table
                dataSource={product.variants}
                columns={[
                  { title: "Name", dataIndex: "name", key: "name" },
                  { title: "SKU", dataIndex: "sku", key: "sku" },
                  {
                    title: "Attributes",
                    key: "attributes",
                    render: (attrs: Record<string, string>) =>
                      Object.entries(attrs).map(([k, v]) => (
                        <Tag key={k} color="blue">
                          {k}: {v}
                        </Tag>
                      )),
                  },
                  {
                    title: "Price",
                    dataIndex: "price",
                    key: "price",
                    render: (v: number) => formatCurrency(v),
                  },
                  { title: "Stock", dataIndex: "stock", key: "stock" },
                ]}
                pagination={false}
              />
            </Card>
          )}
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Basic Information">
            <div className={styles.detailRow}>
              <strong>SKU:</strong> <span>{product.sku}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Slug:</strong> <span>/{product.slug}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Category:</strong> <span>{product.categoryId}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Brand:</strong> <span>{product.brandId}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Status:</strong>{" "}
              <span>
                <Tag color={getStatusColor(product.status)}>
                  {product.status}
                </Tag>
              </span>
            </div>
            <Divider />
            <div className={styles.detailRow}>
              <strong>Price:</strong>{" "}
              <span className={styles.price}>
                {formatCurrency(product.price)}
              </span>
            </div>
            {product.compareAtPrice && (
              <div className={styles.detailRow}>
                <strong>Compare At:</strong>{" "}
                <span className={styles.comparePrice}>
                  {formatCurrency(product.compareAtPrice)}
                </span>
              </div>
            )}
            <div className={styles.detailRow}>
              <strong>Tax:</strong> <span>{product.tax}%</span>
            </div>
            <Divider />
            {product.shortDescription && (
              <>
                <strong>Short Description:</strong>
                <div>{product.shortDescription}</div>
              </>
            )}
            {product.description && (
              <>
                <strong>Description:</strong>
                <div>{product.description}</div>
              </>
            )}
          </Card>

          {product.seo && (product.seo.title || product.seo.description) && (
            <Card title="SEO">
              <div className={styles.detailRow}>
                <strong>Title:</strong> <span>{product.seo.title || "—"}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Description:</strong>{" "}
                <span>{product.seo.description || "—"}</span>
              </div>
              {product.seo.keywords?.length && (
                <div className={styles.detailRow}>
                  <strong>Keywords:</strong>{" "}
                  <span>{product.seo.keywords.join(", ")}</span>
                </div>
              )}
            </Card>
          )}

          <Card title="Meta">
            <div className={styles.detailRow}>
              <strong>Created:</strong>{" "}
              <span>{new Date(product.createdAt).toLocaleString()}</span>
            </div>
            <div className={styles.detailRow}>
              <strong>Updated:</strong>{" "}
              <span>{new Date(product.updatedAt).toLocaleString()}</span>
            </div>
            {product.featured && (
              <div className={styles.detailRow}>
                <Tag color="gold">Featured</Tag>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailPage;
