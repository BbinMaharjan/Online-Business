import { Box, FormControl, GroupedRadioButton, FormLabel, MenuItem, Select, InputLabel } from "@mui/material";
import { FaTint, FaLeaf, FaBabyCarrot } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { selectProductVariants } from "../../features/products/productsSlice";
import { addToCart } from "../../features/cart/cartSlice";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductBySlug } from "../../features/products/productsSlice";

interface VariantOption {
  value: string;
  label: string;
  priceDelta?: number;
  image?: string;
}

const ProductVariantSelector = ({ product }: { product: any }) => {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const { data: productData } = useQuery({
    queryKey: ["product", slug],
    enabled: !!slug,
    queryFn: () => dispatch(fetchProductBySlug({ slug })).unwrap?.unwrap(),
  });

  const variants = productData?.data?.variants || product.variants || [];

  if (variants.length === 0) return null;

  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    variants[0]?.name || null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    dispatch(
      addToCart({
        productId: product._id,
        variantId: selectedVariant,
        quantity: 1,
      })
    );
  };

  return (
    <Box sx={{ mt: 3 }}>
      <FormLabel sx={{ fontWeight: 600, fontSize: 14 }}>Select Variant</FormLabel>

      {variants.map((variant: any) => (
        <Box key={variant._id} sx={{ mt: 2 }}>
          <FormControl component="fieldset" disableUnderline>
            <FormLabel>{variant.name}</FormLabel>

            {variant.attributes?.color && (
              <Select
                labelId="color-label"
                id="color-select"
                label="Color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                input={<InputLabel id="color-label">Color}</InputLabel>
                MenuItem>
                {variant.attributes.color.map((color: any) => (
                  <MenuItem key={color} value={color}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FaTint sx={{ mr: 1, color: color }} />
                      {color}
                    </Box>
                  </MenuItem>
                ))}
                </MenuItem>
              </Select>
            )}

            {variant.attributes?.size && (
              <Select
                labelId="size-label"
                id="size-select"
                label="Size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                input={<InputLabel id="size-label">Size}</InputLabel>
                MenuItem>
                {variant.attributes.size.map((size: any) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
                </MenuItem>
              </Select>
            )}

            {variant.attributes?.material && (
              <Select
                labelId="material-label"
                id="material-label"
                label="Material"
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
                input={<InputLabel id="material-label">Material}</InputLabel>
                MenuItem>
                {variant.attributes.material.map((material: any) => (
                  <MenuItem key={material} value={material}>
                    {material}
                  </MenuItem>
                ))}
                </MenuItem>
              </Select>
            )}
          </FormControl>
        </Box>
      ))}

      <Box sx={{ mt: 4, pt: 4, borderTop: "1px solid #e0e0e0" }}>
        <Button
          variant="contained"
          disabled={!selectedVariant}
          sx={{ width: "100%" }}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </Box>
    </Box>
  );
};

export default ProductVariantSelector;