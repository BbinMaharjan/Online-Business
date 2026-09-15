import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Card,
  message,
  Row,
  Col,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import {
  useCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
} from "./hooks/useCoupons";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import styles from "./CouponFormPage.module.css";

const CouponFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isEdit = !!id;
  const { data: coupon } = useCouponsQuery({});
  const currentCoupon = coupon?.items.find((c: any) => c.code === id);
  const createMutation = useCreateCouponMutation();
  const updateMutation = useUpdateCouponMutation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEdit && currentCoupon) {
      form.setFieldsValue({
        code: currentCoupon.code,
        description: currentCoupon.description,
        discountType: currentCoupon.discountType,
        discountValue: currentCoupon.discountValue,
        minimumOrder: currentCoupon.minimumOrder,
        maximumDiscount: currentCoupon.maximumDiscount,
        usageLimit: currentCoupon.usageLimit,
        usagePerCustomer: currentCoupon.usagePerCustomer,
        startDate: currentCoupon.startDate
          ? new Date(currentCoupon.startDate)
          : null,
        endDate: currentCoupon.endDate ? new Date(currentCoupon.endDate) : null,
        status: currentCoupon.status,
      });
      dispatch(
        setBreadcrumbs([
          { label: "Coupons", path: "/coupons" },
          { label: "Edit Coupon" },
        ]),
      );
    } else {
      dispatch(
        setBreadcrumbs([
          { label: "Coupons", path: "/coupons" },
          { label: "Create Coupon" },
        ]),
      );
    }
  }, [currentCoupon, isEdit, dispatch]);

  const onFinish = async (values: any) => {
    try {
      const data = {
        ...values,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
      };
      if (isEdit) await updateMutation.mutateAsync({ code: id!, data });
      else await createMutation.mutateAsync(data);
      message.success(isEdit ? "Coupon updated" : "Coupon created");
      navigate("/coupons");
    } catch {
      message.error("Failed");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/coupons")}
        >
          Back
        </Button>
        <h1 className={styles.title}>
          {isEdit ? "Edit Coupon" : "Create Coupon"}
        </h1>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className={styles.form}
        initialValues={{
          discountType: "PERCENTAGE",
          discountValue: 10,
          usageLimit: 100,
          usagePerCustomer: 1,
          status: "ACTIVE",
        }}
      >
        <Form.Item name="code" label="Code" rules={[{ required: true }]}>
          <Input placeholder="Coupon code" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input placeholder="Description" />
        </Form.Item>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="discountType"
              label="Discount Type"
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: "PERCENTAGE", label: "Percentage" },
                  { value: "FIXED_AMOUNT", label: "Fixed Amount" },
                ]}
                placeholder="Select type"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="discountValue"
              label="Discount Value"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} precision={2} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="minimumOrder" label="Minimum Order">
              <InputNumber min={0} precision={2} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="maximumDiscount" label="Maximum Discount">
              <InputNumber min={0} precision={2} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="usageLimit"
              label="Usage Limit"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="usagePerCustomer"
              label="Usage Per Customer"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" },
            ]}
            placeholder="Select status"
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" size="large" block>
          {isEdit ? "Save Changes" : "Create Coupon"}
        </Button>
      </Form>
    </div>
  );
};

export default CouponFormPage;
