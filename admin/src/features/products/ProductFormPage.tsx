import { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  Card,
  Tabs,
  Row,
  Col,
  Divider,
  Tag,
  Space,
  Modal,
  message,
  Switch,
  Popconfirm,
  Table,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  PictureOutlined,
  EyeOutlined,
  LoadingOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import {
  useProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} from "./hooks/useProducts";
import { useCategoriesQuery } from "../categories/hooks/useCategories";
import { useBrandsQuery } from "../brands/hooks/useBrands";
import { useUploadMediaMutation } from "../media/hooks/useMedia";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import { Product, Variant } from "../../types";
import { formatCurrency } from "../../utils/formatters";
import styles from "./ProductFormPage.module.css";

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea: TextAreaComponent } = Input;

const variantAttributes = ["Color", "Size", "Material", "Style"];

const ProductFormPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const { data: productResponse, isLoading: productLoading } = useProductQuery(
    id || "",
  );
  const product = productResponse?.data;
  const { data: categories } = useCategoriesQuery({ limit: 1000 });
  const { data: brands } = useBrandsQuery({ limit: 1000 });
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const uploadMutation = useUploadMediaMutation();

  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [variantModalVisible, setVariantModalVisible] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form] = Form.useForm();
  const variantFormRef = useRef<any>(null);

  useEffect(() => {
    if (isEdit && product) {
      form.setFieldsValue({
        name: product.name,
        sku: product.sku,
        slug: product.slug,
        shortDescription: product.shortDescription,
        description: product.description,
        categoryId: product.categoryId,
        brandId: product.brandId,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        tax: product.tax,
        tags: product.tags?.join(", "),
        status: product.status,
        featured: product.featured,
        seoTitle: product.seo?.title,
        seoDescription: product.seo?.description,
        seoKeywords: product.seo?.keywords?.join(", "),
      });
      setImages(product.images || []);
      setVariants(product.variants || []);
    }
  }, [product, isEdit]);

  const handleImageUpload = async (file: File) => {
    try {
      const response = await uploadMutation.mutateAsync({
        file,
        referenceId: id || "temp",
        referenceType: "PRODUCT",
      });
      setImages((prev) => [...prev, response.data.data.url]);
      return response.data.data.url;
    } catch (error) {
      message.error("Failed to upload image");
      throw error;
    }
  };

  const handleImageRemove = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  const handleVariantAdd = (variantData: Variant) => {
    if (editingVariant) {
      setVariants((prev) =>
        prev.map((v) => (v.sku === editingVariant.sku ? variantData : v)),
      );
    } else {
      setVariants((prev) => [...prev, variantData]);
    }
    setVariantModalVisible(false);
    setEditingVariant(null);
  };

  const handleVariantEdit = (variant: Variant) => {
    setEditingVariant(variant);
    setVariantModalVisible(true);
  };

  const handleVariantDelete = (sku: string) => {
    setVariants((prev) => prev.filter((v) => v.sku !== sku));
  };

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const productData = {
        ...values,
        images,
        variants,
        tags:
          values.tags
            ?.split(",")
            .map((t: string) => t.trim())
            .filter(Boolean) || [],
        seo: {
          title: values.seoTitle,
          description: values.seoDescription,
          keywords:
            values.seoKeywords
              ?.split(",")
              .map((k: string) => k.trim())
              .filter(Boolean) || [],
        },
      };

      if (isEdit) {
        await updateMutation.mutateAsync({ id: id!, data: productData });
        message.success("Product updated successfully");
      } else {
        await createMutation.mutateAsync(productData);
        message.success("Product created successfully");
      }
      navigate("/products");
    } catch (error) {
      message.error(
        isEdit ? "Failed to update product" : "Failed to create product",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const breadcrumbs = [
    { label: "Products", path: "/products" },
    { label: isEdit ? "Edit Product" : "Create Product" },
  ];

  useEffect(() => {
    dispatch(setBreadcrumbs(breadcrumbs));
  }, [dispatch, isEdit]);

  if (isEdit && productLoading) {
    return <div className={styles.loading}>Loading product...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {isEdit ? "Edit Product" : "Create Product"}
        </h1>
        <Space>
          <Button onClick={() => navigate("/products")}>Cancel</Button>
          <PermissionGuard permission={isEdit ? "products:update" : "products:create"}>
            <Button
              type="primary"
              htmlType="submit"
              form="product-form"
              loading={submitting}
            >
              {isEdit ? "Save Changes" : "Create Product"}
            </Button>
          </PermissionGuard>
        </Space>
      </div>

      <Form
        id="product-form"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className={styles.form}
        initialValues={{
          status: "DRAFT",
          tax: 0,
          featured: false,
        }}
      >
        <Tabs defaultActiveKey="basic" className={styles.tabs}>
          <TabPane tab="Basic Information" key="basic">
            <Card>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[
                      { required: true, message: "Product name is required" },
                    ]}
                  >
                    <Input placeholder="Enter product name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="sku"
                    label="SKU"
                    rules={[{ required: true, message: "SKU is required" }]}
                  >
                    <Input placeholder="Enter SKU" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="slug"
                    label="Slug"
                    rules={[{ required: true, message: "Slug is required" }]}
                  >
                    <Input placeholder="Enter slug (URL-friendly)" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="categoryId"
                    label="Category"
                    rules={[
                      { required: true, message: "Category is required" },
                    ]}
                  >
                    <Select
                      placeholder="Select category"
                      options={
                        categories?.items?.map((c) => ({
                          value: c._id,
                          label: c.name,
                        })) || []
                      }
                      allowClear
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="brandId"
                    label="Brand"
                    rules={[{ required: true, message: "Brand is required" }]}
                  >
                    <Select
                      placeholder="Select brand"
                      options={
                        brands?.items?.map((b) => ({
                          value: b._id,
                          label: b.name,
                        })) || []
                      }
                      allowClear
                      showSearch
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item name="tags" label="Tags">
                    <Input placeholder="Enter tags separated by commas" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="shortDescription" label="Short Description">
                    <TextAreaComponent
                      rows={2}
                      placeholder="Brief description for listings"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="description" label="Description">
                    <TextAreaComponent
                      rows={6}
                      placeholder="Full product description"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </TabPane>

          <TabPane tab="Pricing" key="pricing">
            <Card>
              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="price"
                    label="Price"
                    rules={[{ required: true, message: "Price is required" }]}
                  >
                    <InputNumber
                      min={0}
                      precision={2}
                      placeholder="0.00"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name="compareAtPrice" label="Compare At Price">
                    <InputNumber
                      min={0}
                      precision={2}
                      placeholder="0.00"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item name="tax" label="Tax (%)">
                    <InputNumber
                      min={0}
                      max={100}
                      precision={2}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </TabPane>

          <TabPane tab="Images" key="images">
            <Card>
              <Upload
                action="/api/upload"
                listType="picture-card"
                fileList={images.map((url, index) => ({
                  uid: index.toString(),
                  name: `image-${index}`,
                  url,
                  thumbUrl: url,
                }))}
                onPreview={() => {}}
                onRemove={(file) => {
                  handleImageRemove(file.url as string);
                  return false;
                }}
                beforeUpload={handleImageUpload}
                maxCount={10}
              >
                <PictureOutlined />
                <div className={styles.uploadHint}>Upload product images</div>
              </Upload>
            </Card>
          </TabPane>

          <TabPane tab="Variants" key="variants">
            <Card>
              <div className={styles.variantsHeader}>
                <span>Product Variants</span>
                <PermissionGuard permission={isEdit ? "products:update" : "products:create"}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setVariantModalVisible(true)}
                  >
                    Add Variant
                  </Button>
                </PermissionGuard>
              </div>

              {variants.length === 0 ? (
                <div className={styles.emptyVariants}>
                  <PictureOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />
                  <p>No variants added yet</p>
                  <PermissionGuard permission={isEdit ? "products:update" : "products:create"}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setVariantModalVisible(true)}
                    >
                      Add First Variant
                    </Button>
                  </PermissionGuard>
                </div>
              ) : (
                <Table
                  dataSource={variants}
                  rowKey="sku"
                  pagination={false}
                  columns={[
                    { title: "Name", dataIndex: "name", key: "name" },
                    { title: "SKU", dataIndex: "sku", key: "sku" },
                    {
                      title: "Attributes",
                      key: "attributes",
                      render: (attributes: Record<string, string>) =>
                        Object.entries(attributes).map(([key, value]) => (
                          <Tag key={key} color="blue">
                            {key}: {value}
                          </Tag>
                        )),
                    },
                    {
                      title: "Price",
                      dataIndex: "price",
                      key: "price",
                      render: (price: number) => formatCurrency(price),
                    },
                    {
                      title: "Stock",
                      dataIndex: "stock",
                      key: "stock",
                    },
                    {
                      title: "Images",
                      key: "images",
                      render: (imgs: string[]) => (
                        <Space>
                          {imgs?.slice(0, 3).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt=""
                              className={styles.variantImage}
                            />
                          ))}
                        </Space>
                      ),
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_: unknown, record: Variant) => (
                        <Space>
                          <PermissionGuard
                            permission={isEdit ? "products:update" : "products:create"}
                          >
                            <Button
                              type="link"
                              icon={<EditOutlined />}
                              onClick={() => handleVariantEdit(record)}
                            />
                            <Popconfirm
                              title="Delete variant?"
                              onConfirm={() => handleVariantDelete(record.sku)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button
                                type="link"
                                danger
                                icon={<DeleteOutlined />}
                              />
                            </Popconfirm>
                          </PermissionGuard>
                        </Space>
                      ),
                    },
                  ]}
                />
              )}
            </Card>
          </TabPane>

          <TabPane tab="SEO" key="seo">
            <Card>
              <Form.Item name="seoTitle" label="Meta Title">
                <Input placeholder="SEO title (max 60 chars)" maxLength={60} />
              </Form.Item>
              <Form.Item name="seoDescription" label="Meta Description">
                <TextAreaComponent
                  rows={3}
                  placeholder="SEO description (max 160 chars)"
                  maxLength={160}
                />
              </Form.Item>
              <Form.Item name="seoKeywords" label="Meta Keywords">
                <Input placeholder="Keywords separated by commas" />
              </Form.Item>
            </Card>
          </TabPane>

          <TabPane tab="Publishing" key="publishing">
            <Card>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select status"
                  options={[
                    { value: "DRAFT", label: "Draft" },
                    { value: "ACTIVE", label: "Active" },
                    { value: "INACTIVE", label: "Inactive" },
                    { value: "ARCHIVED", label: "Archived" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="featured"
                label="Featured Product"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>
          </TabPane>
        </Tabs>
      </Form>

      <Modal
        title={editingVariant ? "Edit Variant" : "Add Variant"}
        open={variantModalVisible}
        onOk={() => {}}
        onCancel={() => {
          setVariantModalVisible(false);
          setEditingVariant(null);
        }}
        width={600}
        destroyOnClose
        footer={[
          <Button key="back" onClick={() => setVariantModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => variantFormRef.current?.validateFields()}
          >
            {editingVariant ? "Save Changes" : "Add Variant"}
          </Button>,
        ]}
      >
        <Form
          ref={variantFormRef}
          layout="vertical"
          initialValues={editingVariant || { attributes: {} }}
          onFinish={handleVariantAdd}
        >
          <Form.Item
            name="name"
            label="Variant Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g., Red / Large" />
          </Form.Item>
          <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
            <Input placeholder="Unique SKU for this variant" />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber min={0} precision={2} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Divider>Attributes</Divider>
          {variantAttributes.map((attr) => (
            <Row key={attr} gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item name={["attributes", attr]} label={attr}>
                  <Input placeholder={`Enter ${attr}`} />
                </Form.Item>
              </Col>
            </Row>
          ))}
          <Divider>Images</Divider>
          <Form.Item name="images" label="Variant Images">
            <Upload
              listType="picture-card"
              maxCount={5}
              beforeUpload={handleImageUpload}
              onRemove={(file) => false}
            >
              <PictureOutlined />
              <div className={styles.uploadHint}>Upload variant images</div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductFormPage;
