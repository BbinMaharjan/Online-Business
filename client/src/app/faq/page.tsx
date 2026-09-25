import { Metadata } from "next";
import { Container, Box, Typography, Accordion, AccordionSummary, AccordionDetails, Paper, Grid, TextField, Button, Link, Divider, InputAdornment } from "@mui/material";
import { Icons } from "@/lib/icons";

const { ExpandMore, Search, Send, LocalShipping, CreditCard, Undo, Refresh, Help } = Icons;

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Storefront - orders, shipping, returns, payments, and more.",
};

const faqCategories = [
  {
    id: "orders",
    title: "Orders & Payments",
    icon: <CreditCard />,
    questions: [
      {
        q: "How do I place an order?",
        a: "Browse our products, add items to your cart, proceed to checkout, enter your shipping and payment details, and confirm your order. You'll receive an email confirmation with your order number."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept major credit cards (Visa, MasterCard, American Express, Discover), debit cards, PayPal, Apple Pay, Google Pay, and Cash on Delivery (COD) in select regions."
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "You can cancel your order within 1 hour of placing it if it hasn't been processed yet. Go to your Account > Orders and click 'Cancel' on the eligible order. Once an order is shipped, it cannot be cancelled."
      },
      {
        q: "How can I check my order status?",
        a: "Log in to your account and go to 'My Orders' to see real-time status updates. You'll also receive email notifications at each stage: confirmed, processing, shipped, and delivered."
      },
      {
        q: "Do you offer gift wrapping or gift messages?",
        a: "Yes! During checkout, you can select gift wrapping for a small fee and add a personalized message. The invoice will not include prices when sent as a gift."
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    icon: <LocalShipping />,
    questions: [
      {
        q: "What are your shipping options and costs?",
        a: "We offer Standard (3-5 business days, free over $50), Express (1-2 business days, $9.99), and Overnight (next business day, $19.99). International shipping varies by destination."
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to over 100 countries. International shipping rates and delivery times vary. Customs duties and taxes are the responsibility of the recipient."
      },
      {
        q: "How can I track my shipment?",
        a: "Once your order ships, you'll receive an email with a tracking number. You can also track it in your account under 'My Orders'."
      },
      {
        q: "What if my package is lost or damaged?",
        a: "Contact our support team within 48 hours of the expected delivery date. We'll investigate with the carrier and issue a replacement or refund."
      },
      {
        q: "Can I change my shipping address after ordering?",
        a: "You can update the address within 1 hour of placing the order if it hasn't shipped. After that, contact support immediately and we'll try to intercept the package."
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & Refunds",
    icon: <Undo />,
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day return policy for most items. Products must be in original condition with tags and packaging. Some categories (underwear, swimwear, personalized items) are final sale."
      },
      {
        q: "How do I start a return?",
        a: "Go to your Account > Orders, select the order, click 'Return Items', choose the reason, and print the prepaid return label. Drop off at any authorized location."
      },
      {
        q: "How long does a refund take?",
        a: "Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be issued to your original payment method."
      },
      {
        q: "Do you offer exchanges?",
        a: "Yes! For size or color exchanges, select 'Exchange' when starting a return. We'll ship the new item once we receive your return. Exchanges are free for size/color changes."
      },
      {
        q: "What if I receive a defective or wrong item?",
        a: "We apologize! Contact support within 48 hours with photos. We'll send a prepaid return label and ship a replacement immediately at no cost to you."
      },
    ],
  },
  {
    id: "account",
    title: "Account & Security",
    icon: <CreditCard />,
    questions: [
      {
        q: "How do I create an account?",
        a: "Click 'Register' in the top right, enter your name, email, and password. You'll receive a verification email. Once verified, you can enjoy faster checkout, order tracking, and wishlist features."
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "Click 'Forgot Password' on the login page, enter your email, and we'll send a reset link. The link expires in 1 hour for security."
      },
      {
        q: "Is my personal information secure?",
        a: "Absolutely. We use SSL encryption for all data transmission, never store full credit card details, and comply with PCI DSS standards. See our Privacy Policy for details."
      },
      {
        q: "How do I update my account information?",
        a: "Log in and go to 'Account > Profile' to update your name, email, phone, and password. You can also manage addresses and notification preferences."
      },
      {
        q: "Can I delete my account?",
        a: "Yes, contact our support team to request account deletion. Note that this will permanently remove your order history, wishlist, and saved addresses."
      },
    ],
  },
  {
    id: "products",
    title: "Products & Availability",
    icon: <Refresh />,
    questions: [
      {
        q: "Are your products authentic?",
        a: "Yes, 100%. We source directly from brands and authorized distributors. Every product goes through quality checks before shipping."
      },
      {
        q: "What does 'Out of Stock' mean? Will it be restocked?",
        a: "It means the item is currently unavailable. Click 'Notify Me' on the product page to get an email when it's back in stock. Restock timing varies by brand."
      },
      {
        q: "Do you price match?",
        a: "We monitor competitor prices daily to offer the best value. If you find a lower price from an authorized retailer within 14 days of purchase, contact us for a price adjustment."
      },
      {
        q: "Can I pre-order upcoming products?",
        a: "Yes! Products available for pre-order will be marked on the product page. Your payment is charged at the time of pre-order, and you'll receive estimated shipping dates."
      },
      {
        q: "How accurate are product images and descriptions?",
        a: "We strive for accuracy, but colors may vary slightly due to screen settings. Check the specifications and reviews for detailed information. Contact us if something seems incorrect."
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" sx={{ mb: 1, fontWeight: 700, textAlign: "center" }}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" sx={{ mb: 6, textAlign: "center", color: "text.secondary" }}>
          Can't find what you're looking for? <Link href="/contact" color="primary">Contact us</Link>
        </Typography>

        {/* Search */}
        <Paper elevation={1} sx={{ p: 3, mb: 6 }}>
          <TextField
            fullWidth
            placeholder="Search FAQs..."
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
            }}
            sx={{ maxWidth: 600 }}
          />
        </Paper>

        {/* Categories */}
        <Grid container spacing={4}>
          {faqCategories.map((category) => (
            <Grid size={{ xs: 12, md: 6, lg: 3 }} key={category.id}>
              <Paper elevation={1} sx={{ p: 3, height: "100%", textAlign: "center" }}>
                <Box sx={{ display: "inline-flex", p: 1.5, backgroundColor: "primary.light", borderRadius: "50%", color: "primary.contrastText", mb: 2 }}>
                  {category.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {category.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.questions.length} questions
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 6 }} />

        {/* FAQ Content */}
        {faqCategories.map((category) => (
          <Box key={category.id} id={category.id} sx={{ mb: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <Box sx={{ p: 0.75, backgroundColor: "primary.light", borderRadius: 1, color: "primary.contrastText" }}>
                {category.icon}
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0 }}>
                {category.title}
              </Typography>
            </Box>

            {category.questions.map((faq, index) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls={`panel-${category.id}-${index}`}
                  id={`panel-${category.id}-${index}-header`}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ))}

        {/* Still need help */}
        <Paper elevation={2} sx={{ p: { xs: 4, md: 6 }, textAlign: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", borderRadius: 3 }}>
          <Help sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Still Need Help?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}>
            Our support team is here to help you 24/7
          </Typography>
          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Link href="/contact">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Send />}
                  sx={{ px: 4, backgroundColor: "secondary.main", "&:hover": { backgroundColor: "secondary.dark" } }}
                >
                  Contact Support
                </Button>
              </Link>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Link href="/account/orders">
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ px: 4 }}
                >
                  Check Order Status
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
}