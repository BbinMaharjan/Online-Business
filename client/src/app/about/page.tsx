import { Metadata } from "next";
import { Container, Box, Typography, Grid, Paper, Button, Divider } from "@mui/material";
import Link from "next/link";
import { Support, LocalShipping, Verified, Favorite, Groups, Business, ThumbUp, Nature } from "@mui/icons-material";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Storefront - your trusted online shopping destination for quality products at great prices.",
};

const values = [
  { icon: <ThumbUp />, title: "Quality First", description: "We carefully curate every product to ensure the highest quality standards." },
  { icon: <Nature />, title: "Sustainability", description: "Committed to eco-friendly practices and sustainable sourcing." },
  { icon: <Support />, title: "Customer Support", description: "Our dedicated team is here to help you 24/7." },
  { icon: <Verified />, title: "Secure Shopping", description: "Your security and privacy are our top priorities." },
];

const team = [
  { name: "Sarah Johnson", role: "Founder & CEO", bio: "Former retail executive with 15+ years experience" },
  { name: "Michael Chen", role: "CTO", bio: "Tech innovator passionate about e-commerce" },
  { name: "Emily Rodriguez", role: "Head of Operations", bio: "Supply chain expert ensuring smooth delivery" },
  { name: "David Kim", role: "Creative Director", bio: "Award-winning designer focused on user experience" },
];

const stats = [
  { value: "50,000+", label: "Happy Customers" },
  { value: "10,000+", label: "Products" },
  { value: "500+", label: "Brands" },
  { value: "99%", label: "Satisfaction Rate" },
];

export default function AboutPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 6 }}>
        {/* Hero Section */}
        <Paper elevation={2} sx={{ p: { xs: 4, md: 6 }, mb: 6, textAlign: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", borderRadius: 3 }}>
          <Typography variant="h2" sx={{ mb: 2, fontWeight: 700 }}>
            About Storefront
          </Typography>
          <Typography variant="h5" sx={{ mb: 3, opacity: 0.9, fontWeight: 300 }}>
            Your trusted destination for quality products at unbeatable prices
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 700, mx: "auto", opacity: 0.85 }}>
            Founded in 2020, Storefront has grown from a small startup to a leading online marketplace.
            We believe everyone deserves access to quality products without breaking the bank.
          </Typography>
        </Paper>

        {/* Mission & Vision */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ mb: 4, textAlign: "center", fontWeight: 700 }}>
            Our Mission & Vision
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 4, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box sx={{ p: 1.5, backgroundColor: "primary.light", borderRadius: 2, color: "primary.contrastText", mr: 2 }}>
                    <Groups fontSize="large" />
                  </Box>
                  <Typography variant="h5" fontWeight={700}>Our Mission</Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  To make quality products accessible to everyone by providing a seamless, secure,
                  and enjoyable online shopping experience. We strive to be the go-to destination
                  for smart shoppers who value quality, affordability, and convenience.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 4, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box sx={{ p: 1.5, backgroundColor: "secondary.light", borderRadius: 2, color: "secondary.contrastText", mr: 2 }}>
                    <Business fontSize="large" />
                  </Box>
                  <Typography variant="h5" fontWeight={700}>Our Vision</Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  To become the world's most customer-centric online marketplace, where anyone can
                  find and discover anything they might want to buy online. We aim to set new
                  standards for transparency, sustainability, and customer satisfaction in e-commerce.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Core Values */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ mb: 4, textAlign: "center", fontWeight: 700 }}>
            Our Core Values
          </Typography>
          <Grid container spacing={3}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper elevation={1} sx={{ p: 3, height: "100%", textAlign: "center", transition: "transform 0.2s, box-shadow 0.2s", "&:hover": { transform: "translateY(-4px)", boxShadow: 4 } }}>
                  <Box sx={{ display: "inline-flex", p: 1, backgroundColor: "primary.light", borderRadius: "50%", color: "primary.contrastText", mb: 2 }}>
                    {value.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Stats */}
        <Box sx={{ mb: 6, py: 4, backgroundColor: "grey.50", borderRadius: 2 }}>
          <Typography variant="h3" sx={{ mb: 4, textAlign: "center", fontWeight: 700 }}>
            By The Numbers
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index} sx={{ textAlign: "center" }}>
                <Typography variant="h2" fontWeight={800} color="primary.main">
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ mb: 4, textAlign: "center", fontWeight: 700 }}>
            Meet Our Team
          </Typography>
          <Grid container spacing={4}>
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper elevation={1} sx={{ p: 3, textAlign: "center", height: "100%" }}>
                  <Avatar sx={{ width: 80, height: 80, mx: "auto", mb: 2, fontSize: "2rem", backgroundColor: "primary.main" }}>
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </Avatar>
                  <Typography variant="h6" fontWeight={700}>{member.name}</Typography>
                  <Typography variant="subtitle1" color="primary.main" sx={{ mb: 1, display: "block" }}>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Why Choose Us */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ mb: 4, textAlign: "center", fontWeight: 700 }}>
            Why Choose Storefront?
          </Typography>
          <Grid container spacing={3}>
            {[
              { icon: <LocalShipping />, title: "Fast & Free Shipping", desc: "Free shipping on orders over $50. Most orders delivered within 2-3 business days." },
              { icon: <Verified />, title: "Easy Returns", desc: "30-day hassle-free return policy. No questions asked." },
              { icon: <Support />, title: "24/7 Support", desc: "Our friendly support team is always here to help." },
              { icon: <Favorite />, title: "Best Prices", desc: "We monitor prices daily to ensure you get the best deals." },
              { icon: <ThumbUp />, title: "Quality Guaranteed", desc: "Every product is vetted for quality before it reaches you." },
              { icon: <Nature />, title: "Eco-Friendly", desc: "Sustainable packaging and carbon-neutral shipping options." },
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper elevation={1} sx={{ p: 3, height: "100%", textAlign: "center" }}>
                  <Box sx={{ display: "inline-flex", p: 1, backgroundColor: "primary.light", borderRadius: "50%", color: "primary.contrastText", mb: 2 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA */}
        <Paper elevation={2} sx={{ p: { xs: 4, md: 6 }, textAlign: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", borderRadius: 3 }}>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Ready to Shop?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}>
            Join thousands of happy customers and discover amazing products today
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/products"
            passHref
            sx={{ px: 6, py: 1.5, backgroundColor: "secondary.main", "&:hover": { backgroundColor: "secondary.dark" } }}
          >
            Start Shopping Now
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}