import { Metadata } from "next";
import Link from "next/link";
import { Container, Box, Typography, Grid, Paper, TextField, Button } from "@mui/material";
import { Icons } from "@/lib/icons";

const { Email, Phone: PhoneIcon, LocationOn, SupportAgent: Support, Send, Map } = Icons;

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Storefront customer support. We're here to help with any questions or concerns.",
};

const contactInfo = [
  {
    icon: <Email />,
    title: "Email Us",
    details: [
      "support@storefront.com",
      "sales@storefront.com",
      "partnerships@storefront.com",
    ],
    description: "We typically respond within 24 hours",
  },
  {
    icon: <PhoneIcon />,
    title: "Call Us",
    details: [
      "1-800-STOREFRONT (1-800-786-7337)",
      "Monday - Friday: 9 AM - 8 PM EST",
      "Saturday - Sunday: 10 AM - 6 PM EST",
    ],
    description: "Available for immediate assistance",
  },
  {
    icon: <LocationOn />,
    title: "Visit Us",
    details: [
      "123 Commerce Street",
      "San Francisco, CA 94105",
      "United States",
    ],
    description: "Headquarters (by appointment only)",
  },
  {
    icon: <Support />,
    title: "Help Center",
    details: [
      "Browse FAQs and guides",
      "Track your order",
      "Return & refund policy",
    ],
    description: "Find answers instantly",
    link: "/faq",
  },
];

export default function ContactPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" sx={{ mb: 1, fontWeight: 700, textAlign: "center" }}>
          Contact Us
        </Typography>
        <Typography variant="h6" sx={{ mb: 6, textAlign: "center", color: "text.secondary" }}>
          We'd love to hear from you. Reach out through any of the channels below.
        </Typography>

        <Grid container spacing={4}>
          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {contactInfo.map((item, index) => (
                <Paper key={index} elevation={1} sx={{ p: 3, height: "100%" }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                    <Box sx={{ p: 1, backgroundColor: "primary.light", borderRadius: 2, color: "primary.contrastText", flexShrink: 0 }}>
                      {item.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {item.title}
                      </Typography>
                      {item.details.map((detail, i) => (
                        <Typography key={i} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {detail}
                        </Typography>
                      ))}
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                        {item.description}
                      </Typography>
{item.link && (
                      <Box sx={{ mt: 1 }}>
                        <Link href={item.link} style={{ display: "inline-block" }}>
                          Visit Help Center →
                        </Link>
                      </Box>
                    )}
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Grid>

          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper elevation={2} sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Send Us a Message
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Fill out the form below and we'll get back to you as soon as possible.
              </Typography>

              <form onSubmit={(e) => { e.preventDefault(); alert("Message sent! We'll get back to you soon."); }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone (Optional)"
                      type="tel"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      select
                      label="Subject"
                      required
                    >
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="technical">Technical Support</option>
                      <option value="partnership">Partnership Opportunities</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="other">Other</option>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Message"
                      multiline
                      rows={6}
                      required
                      placeholder="Please provide as much detail as possible..."
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<Send />}
                      sx={{ py: 1.5 }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>

        {/* Map Placeholder */}
        <Box sx={{ mt: 6 }}>
          <Paper elevation={1} sx={{ p: 0, overflow: "hidden", borderRadius: 2 }}>
            <Box sx={{ height: 300, backgroundColor: "grey.100", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box sx={{ textAlign: "center", color: "text.secondary" }}>
                <Map sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>Interactive Map</Typography>
                <Typography variant="body2">Map integration would go here (Google Maps, Mapbox, etc.)</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* FAQ Quick Links */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, textAlign: "center" }}>
            Quick Help
          </Typography>
          <Grid container spacing={3} sx={{ justifyContent: "center" }}>
            {[
              { title: "Track Your Order", desc: "Check order status and delivery updates", link: "/account/orders" },
              { title: "Returns & Refunds", desc: "Learn about our 30-day return policy", link: "/faq#returns" },
              { title: "Shipping Info", desc: "Delivery times, costs, and international shipping", link: "/faq#shipping" },
              { title: "Payment Methods", desc: "Accepted payment options and security", link: "/faq#payments" },
            ].map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Paper elevation={1} sx={{ p: 3, textAlign: "center", transition: "transform 0.2s", "&:hover": { transform: "translateY(-2px)" } }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.desc}
                  </Typography>
                  <Link href={item.link} style={{ color: "primary.main" }}>
                    Learn More →
                  </Link>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}