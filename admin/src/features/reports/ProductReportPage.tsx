import { Card, Statistic, Table, Row, Col, DatePicker, Select } from "antd";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import { useProductReportQuery } from "./hooks/useReports";
import { formatCurrency, formatNumber } from "../../utils/formatters";

const ProductReportPage = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useProductReportQuery({});
  return (
    <div className="report-page">
      <div className="report-header">
        <h1>Product Report</h1>
        <p>Best selling products</p>
      </div>
      <Card>
        <Table
          dataSource={data?.data || []}
          loading={isLoading}
          columns={[
            { title: "Product", dataIndex: "productName", key: "productName" },
            { title: "SKU", dataIndex: "sku", key: "sku" },
            {
              title: "Qty Sold",
              dataIndex: "quantitySold",
              key: "quantitySold",
            },
            {
              title: "Revenue",
              dataIndex: "revenue",
              key: "revenue",
              render: (v: number) => formatCurrency(v),
            },
          ]}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ProductReportPage;
