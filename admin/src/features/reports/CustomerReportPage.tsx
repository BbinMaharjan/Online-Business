import { Card, Statistic, Table, Row, Col, DatePicker, Select } from "antd";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import { useCustomerReportQuery } from "./hooks/useReports";
import { formatCurrency, formatNumber } from "../../utils/formatters";

const CustomerReportPage = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useCustomerReportQuery({});
  return (
    <div className="report-page">
      <div className="report-header">
        <h1>Customer Report</h1>
        <p>Top customers by spending</p>
      </div>
      <Card>
        <Table
          dataSource={data?.data || []}
          loading={isLoading}
          columns={[
            {
              title: "Customer",
              dataIndex: "customerName",
              key: "customerName",
            },
            { title: "Email", dataIndex: "email", key: "email" },
            { title: "Orders", dataIndex: "totalOrders", key: "totalOrders" },
            {
              title: "Total Spent",
              dataIndex: "totalSpent",
              key: "totalSpent",
              render: (v: number) => formatCurrency(v),
            },
          ]}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default CustomerReportPage;
