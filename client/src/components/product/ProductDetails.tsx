import { Box, Typography, Rating, Stack, Button } from "@mui/material";
import { FaHeart } from "react-icons/fa";

const ProductDetails = ({ product }: { product: any }) => {
  const { description, specifications, rating, reviewCount } = product;

  return (
    <Box sx={{ pt: 3 }}>
      <Typography variant="body1" component="p" sx={{ lineHeight: 1.6 }}>
        {description}
      </Typography>

      {specifications && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Specifications
          </Typography>
          <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
            {Object.entries(specifications).map(([key, value]: any) => (
              <Box key={key} sx={{ width: "50%" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
                  {key}
                </Typography>
                <Typography variant="body1">{value}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Rating
          name="product-rating"
          value={rating}
          size="small"
          readOnly
        />
        <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
          {reviewCount} reviews
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductDetails;