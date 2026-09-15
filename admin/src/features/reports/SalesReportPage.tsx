import { useState } from "react";
import {
  DatePicker,
  Select,
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Space,
  Button,
  message,
} from "antd";
import {
  DownOutlined,
  ReloadOutlined,
  DollarCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import { useSalesReportQuery } from "./hooks/useReports";
import { formatCurrency, formatNumber } from "../../utils/formatters";
import styles from "./SalesReportPage.module.css";

const { RangePicker } = DatePicker;
const { Option } = Select;

const SalesReportPage = () => {
  const dispatch = useAppDispatch();
  const [period, setPeriod] = useState("30d");
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const filters = dateRange
    ? {
        startDate: dateRange[0].toISOString().split("T")[0],
        endDate: dateRange[1].toISOString().split("T")[0],
      }
    : { period };
  const { data, isLoading } = useSalesReportQuery(filters);

  const summary = data?.reduce(
    (acc, cur) => ({
      revenue: acc.revenue + cur.revenue,
      orders: acc.orders + cur.orders,
    }),
    { revenue: 0, orders: 0 },
  ) || { revenue: 0, orders: 0 };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Sales Report</h1>
          <p className={styles.subtitle}>View sales performance</p>
        </div>
      </div>
      <Card className={styles.filterCard}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <RangePicker
              style={{ width: "100%" }}
              onChange={setDateRange}
              placeholder={["Start Date", "End Date"]}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Select
              style={{ width: "100%" }}
              value={period}
              onChange={setPeriod}
              options={[
                "today",
                "yesterday",
                "7d",
                "30d",
                "this_month",
                "last_month",
                "custom",
              ].map((v) => ({ value: v, label: v.replace("_", " ") }))}
            />
          </Col>
        </Row>
      </Card>
      <Row gutter={16} className={styles.kpiRow}>
        <Col xs={24}>
          <Row gutter={16}>
            {[
              {
                title: "Total Revenue",
                value: summary.revenue,
                icon: (
                  <DollarCircleOutlined
                    style={{ color: "#1890ff", fontSize: 24 }}
                  />
                ),
                color: "#1890ff",
              },
              {
                title: "Total Orders",
                value: summary.orders,
                icon: (
                  <ShoppingCartOutlined
                    style={{ color: "#52c41a", fontSize: 24 }}
                  />
                ),
                color: "#52c41a",
              },
              {
                title: "Avg Order Value",
                value: summary.orders ? summary.revenue / summary.orders : 0,
                icon: (
                  <DollarCircleOutlined
                    style={{ color: "#722ed1", fontSize: 24 }}
                  />
                ),
                color: "#722ed1",
              },
            ].map((card, index) => (
              <Col key={index} xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title={card.title}
                    value={card.value}
                    prefix={card.icon}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Card>
        <Table
          dataSource={data || []}
          loading={isLoading}
          columns={[
            { title: "Date", dataIndex: "date", key: "date" },
            {
              title: "Revenue",
              dataIndex: "revenue",
              key: "revenue",
              render: (v: number) => formatCurrency(v),
            },
            { title: "Orders", dataIndex: "orders", key: "orders" },
            {
              title: "Avg Order Value",
              dataIndex: "averageOrderValue",
              key: "averageOrderValue",
              render: (v: number) => formatCurrency(v),
            },
          ]}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default SalesReportPage;
