import { Box, Skeleton, Avatar } from "@mui/material";

const SkeletonProductCard = ({ count = 3 }: { count?: number }) => {
  return (
    <Box sx={{ display: "grid", gap: 2, marginBottom: 3 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          component="div"
          style={{
            borderRadius: 2,
            height: 250,
            width: "100%",
          }}
        />
      ))}
    </Box>
  );
};

export default SkeletonProductCard;