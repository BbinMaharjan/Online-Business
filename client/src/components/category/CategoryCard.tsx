import { Card, CardContent, Typography, Box, Link } from "@mui/material";

interface CategoryCardProps {
  category: {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    productsCount?: number;
  };
}

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

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
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
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
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