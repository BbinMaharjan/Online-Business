import { useState } from "react";
import { Upload, Button, Card, Grid, message } from "antd";
import { PictureOutlined, LoadingOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../store/hooks";
import { setBreadcrumbs } from "../../store/uiSlice";
import { useUploadMediaMutation } from "./hooks/useMedia";
import { PermissionGuard } from "../../components/common/PermissionGuard";
import styles from "./MediaPage.module.css";

const MediaPage = () => {
  const dispatch = useAppDispatch();
  const uploadMutation = useUploadMediaMutation();
  const [files, setFiles] = useState<any[]>([]);

  const handleUpload = async (file: File) => {
    try {
      const res = await uploadMutation.mutateAsync({
        file,
        referenceId: "media-library",
        referenceType: "PRODUCT",
      });
      setFiles((prev) => [
        ...prev,
        {
          uid: Date.now().toString(),
          name: file.name,
          url: res.data.url,
          thumbUrl: res.data.url,
        },
      ]);
      message.success("Uploaded successfully");
    } catch {
      message.error("Upload failed");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Media Library</h1>
          <p className={styles.subtitle}>Manage uploaded images and files</p>
        </div>
      </div>
      <Card className={styles.uploadCard}>
        <PermissionGuard permission="MEDIA_CREATE">
          <Upload
            action="/api/upload"
            listType="picture-card"
            fileList={files}
            beforeUpload={handleUpload}
            onRemove={(file) => {
              setFiles((prev) => prev.filter((f) => f.uid !== file.uid));
              return false;
            }}
            maxCount={50}
            multiple
          >
            <PictureOutlined />
            <div className={styles.uploadHint}>
              Drag & drop or click to upload
            </div>
          </Upload>
        </PermissionGuard>
      </Card>
      <Card title="Uploaded Files">
        <div className={styles.grid}>
          {files.map((file) => (
            <div key={file.uid} className={styles.fileItem}>
              <img src={file.thumbUrl} alt={file.name} />
              <div className={styles.fileName}>{file.name}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MediaPage;
