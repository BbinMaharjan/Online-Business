import { Metadata } from "next";
import { Container, Box, Typography, Paper, Divider } from "@mui/material";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Storefront Terms of Service - Please read these terms carefully before using our website and services.",
};

const lastUpdated = "September 25, 2026";

export default function TermsPage() {
  return (
    <Container maxWidth="3xl">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" sx={{ mb: 1, fontWeight: 700, textAlign: "center" }}>
          Terms of Service
        </Typography>
        <Typography variant="body1" sx={{ mb: 6, textAlign: "center", color: "text.secondary" }}>
          Last updated: {lastUpdated}
        </Typography>

        <Paper elevation={1} sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="body1" paragraph>
            Welcome to Storefront ("we", "our", "us"). These Terms of Service ("Terms") govern your access to and use of our website, mobile applications, and services (collectively, the "Service"). Please read these Terms carefully before using our Service.
          </Typography>

          <Typography variant="body1" paragraph>
            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Service.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <section sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>1. Account Registration</Typography>
            <Typography variant="body1" paragraph>
              To use certain features of the Service, you may be required to register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
            </Typography>
            <Typography variant="body1" paragraph>
              You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </Typography>
          </section>

          <section sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>2. Orders and Payments</Typography>
            <Typography variant="body1" paragraph>
              All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including but not limited to: pricing errors, inventory limitations, suspected fraud, or violation of these Terms.
            </Typography>
            <Typography variant="body1" paragraph>
              Prices are subject to change without notice. We strive for accuracy, but errors may occur. If a product's correct price is higher than the listed price, we may contact you for instructions or cancel the order.
            </Typography>
            <Typography variant="body1" paragraph>
              Payment must be received in full before we ship your order. We accept various payment methods as indicated during checkout.
            </Typography>
          </section>

          <section sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>3. Shipping and Delivery</Typography>
            <Typography variant="body1" paragraph>
              We will make reasonable efforts to ship your order within the timeframes indicated during checkout. However, delivery dates are estimates only and we are not liable for delays caused by carriers, weather, customs, or other circumstances beyond our control.
            </Typography>
            <Typography variant="body1" paragraph>
              Risk of loss and title for items purchased pass to you upon delivery to the carrier. You are responsible for inspecting shipments upon receipt and reporting any damage or discrepancies within 48 hours.
            </Typography>
          </section>

          <section sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>4. Returns and Refunds</Typography>
            <Typography variant="body1" paragraph>
              We offer a 30-day return policy for most new, unopened items in original packaging. Certain products (personalized items, intimate apparel, digital goods) are not returnable. See our Return Policy page for full details.
            </Typography>
            <Typography variant="body1" paragraph>
              Refunds are issued to the original payment method within 5-7 business days of receiving the returned item. Shipping costs are non-refundable unless the return is due to our error.
            </Typography>
          </section>

          <section sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>5. Intellectual Property</Typography>
            <Typography variant="body1" paragraph>
              All content on the Service, including text, graphics, logos, images, and software, is the property of Storefront or its licensors and is protected by copyright, trademark, and other intellectual property laws.
            </Typography>
            <Typography variant="body1" paragraph>
              You may not reproduce, distribute, modify, create derivative works, publicly display, or commercially exploit any content without our prior written consent.
            </Typography>
          </section>

          <section sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>6. User Content</Typography>
            <Typography variant="body1" paragraph>
              You may submit reviews, ratings, comments, and other content ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content in connection with the Service.
            </Typography>
            <Typography variant="body1" paragraph>
              You represent that you own or have rights to all User Content you submit, and that it does not violate any third-party rights or applicable laws. We reserve the right to remove any User Content at our discretion.
            </Typography>
          </section>

          <section sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>7. Prohibited Activities</Typography>
            <Typography variant="body1" paragraph>
              You agree not to:
            </Typography>
            <Typography variant="body1" paragraph>
              • Use the Service for any unlawful purpose or in violation of these Terms
            </Typography>
            <Typography variant="body1" paragraph>
              • Attempt to gain unauthorized access to any systems or networks
            </Typography>
            <Typography variant="body1" paragraph>
              • Interfere with or disrupt the Service or servers
            </Typography>
            <Typography variant="body1" paragraph>
              • Use automated means to access the Service (scraping, bots, etc.)
            </Typography>
            <Typography variant="body1" paragraph>
              • Transmit viruses, malware, or harmful code
            </Typography>
            <Typography variant="body1" paragraph>
              • Impersonate any person or entity
            </Typography>
          </section>

          <section sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>8. Disclaimers and Limitation of Liability</Typography>
            <Typography variant="body1" paragraph>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </Typography>
            <Typography variant="body1" paragraph>
              IN NO EVENT SHALL STOREFRONT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.
            </Typography>
            <Typography variant="body1" paragraph>
              Our total liability for any claim arising from these Terms shall not exceed the amount you paid for the relevant order in the 12 months preceding the claim.
            </Typography>
          </section>

          <section sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>9. Indemnification</Typography>
            <Typography variant="body1" paragraph>
              You agree to indemnify, defend, and hold harmless Storefront and its officers, directors, employees, and agents from any claims, damages, losses, and expenses (including attorney fees) arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
            </Typography>
          </section>

          <section sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>10. Governing Law and Disputes</Typography>
            <Typography variant="body1" paragraph>
              These Terms shall be governed by the laws of the State of California, USA, without regard to conflict of law principles. Any disputes arising from these Terms shall be resolved through binding arbitration in San Francisco, California, in accordance with the rules of the American Arbitration Association.
            </Typography>
          </section>

          <section sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>11. Changes to Terms</Typography>
            <Typography variant="body1" paragraph>
              We may modify these Terms at any time. Changes will be effective upon posting the updated Terms on this page with a revised "Last updated" date. Your continued use of the Service after changes constitutes acceptance of the new Terms.
            </Typography>
          </section>

          <section sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>12. Contact Information</Typography>
            <Typography variant="body1" paragraph>
              If you have questions about these Terms, please contact us at:
            </Typography>
            <Typography variant="body1" paragraph>
              Storefront Legal Department<br />
              123 Commerce Street<br />
              San Francisco, CA 94105<br />
              Email: legal@storefront.com
            </Typography>
          </section>
        </Paper>
      </Box>
    </Container>
  );
}