import { Result, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className={styles.container}>
      <Result
        status="404"
        title="Page Not Found"
        subTitle="Sorry, the page you are looking for does not exist or has been moved."
        extra={
          <Button type="primary" icon={<HomeOutlined />} onClick={handleBackHome}>
            Back to Dashboard
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;