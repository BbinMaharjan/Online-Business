import { Card, CardContent, Typography, Box, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface CategoryCardProps {
  category: {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    productsCount?: number;
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const theme = useTheme();

  const categoryIcons: Record<string, string> = {
    electronics: "📱",
    clothing: "👕",
    home: "🏠",
    sports: "⚽",
    beauty: "💄",
    books: "📚",
    toys: "🧸",
    automotive: "🚗",
  };

  return (
    <Link href={`/categories/${category.slug}`} passHref style={{ textDecoration: "none", color: "inherit" }}>
      <Card sx={{ height: "100%", transition: "transform 0.2s, box-shadow 0.2s", "&:hover": { transform: "translateY(-4px)", boxShadow: 3 } }}>
        <Box
          sx={{
            height: 120,
            backgroundColor: "primary.50",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <Box sx={{ fontSize: 48 }}>
              {categoryIcons[category.slug] || categoryIcons[category.name.toLowerCase()] || "📦"}
            </Box>
          )}
        </Box>
        <CardContent>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
            {category.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {category.productsCount || 0} products
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}