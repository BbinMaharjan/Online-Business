import { Card, CardActionArea, CardContent, CardMedia, Button, Rating, Stack } from "@mui/material";
import { Link } from "next/link";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../../features/wishlist/wishlistSlice";
import { useDispatch } from "react-redux";

interface ProductCardProps {
  product: any;
  user?: any;
}

const ProductCard = ({ product, user }: ProductCardProps) => {
  const dispatch = useDispatch();
  const { toggleWishlist } = useWishlist();

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product._id));
  };

  return (
    <Card sx={{ width: "100%", marginBottom: 2 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height: 200
          sx={{
            objectFit: "cover",
            borderRadius: 2,
            mt: -1,
          }}
          alt={product.name}
        >
          <img
            src={product.images?.[0] || "/placeholder-product.jpg"}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </CardMedia>

        <CardContent>
          <Stack direction="spacing" sx={{ pl: 1, pb: 1 }}>
            <Typography variant="body2" component="h3" sx={{ fontSize: 14 }}>
              <Link href={`/products/${product.slug}`} style={{ textDecoration: "none" }}>
                {product.name}
              </Link>
            </Typography>

            <Stack direction="row" spacing={1}>
              {product.brand && (
                <Typography variant="caption" color="text.secondary">
                  {product.brand.name}
                </Typography>
              )}

              {product.rating && (
                <Rating
                  name="rating"
                  value={product.rating}
                  size="small"
                  readOnly
                  sx={{ float: "right" }}
                />
              )}
            </Stack>

            <Typography variant="body2" color="text.primary" sx={{ pr: 1 }}>
              ${product.price.toFixed(2)}
            </Typography>

            {product.compareAtPrice && (
              <Typography variant="caption" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                ${product.compareAtPrice.toFixed(2)}
              </Typography>
            )}

            {product.stock === 0 && (
              <Typography variant="caption" color="error">
                Out of stock
              </Typography>
            )}
          </Stack>
        </CardContent>

        <CardActionArea>
          <Button
            variant="contained"
            size="small"
            sx={{ mt: 1, width: "100" }}
            onClick={() => {}}
            disabled={product.stock === 0}
          >
            Add to cart
          </Button>
        </CardActionArea>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;