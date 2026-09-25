import { Metadata } from "next";
import { Container, Box, Typography, Paper, Divider } from "@mui/material";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Storefront Privacy Policy - Learn how we collect, use, and protect your personal information.",
};

const lastUpdated = "September 25, 2026";

export default function PrivacyPage() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 6 }}>
        <Typography variant="h2" sx={{ mb: 1, fontWeight: 700, textAlign: "center" }}>
          Privacy Policy
        </Typography>
        <Typography variant="body1" sx={{ mb: 6, textAlign: "center", color: "text.secondary" }}>
          Last updated: {lastUpdated}
        </Typography>

        <Paper elevation={1} sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Storefront ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile applications, and purchase our products and services (collectively, the "Service").
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            By using our Service, you agree to the collection and use of information in accordance with this policy.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>1. Information We Collect</Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>Personal Information</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We collect information you provide directly to us, including:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-line" }}>
              • Account information: name, email address, phone number, password (encrypted)
              • Billing and shipping addresses
              • Payment information (processed securely by our payment partners - we do not store full card details)
              • Order history and preferences
              • Communications with customer support
              • Product reviews and ratings
              • Wishlist items
            </Typography>

            <Typography variant="h6" sx={{ mb: 1, mt: 3 }}>Automatically Collected Information</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              When you use our Service, we automatically collect:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-line" }}>
              • Device information: IP address, browser type, operating system, device identifiers
              • Usage data: pages visited, time spent, click paths, search queries
              • Location data (with your consent): approximate location for shipping estimates
              • Cookies and similar technologies: see our Cookie Policy below
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>2. How We Use Your Information</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We use your information to:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-line" }}>
              • Process and fulfill orders, including payment processing and shipping
              • Manage your account and provide customer support
              • Send order confirmations, shipping updates, and transactional emails
              • Personalize your experience and recommend products
              • Improve our Service, website, and product offerings
              • Detect and prevent fraud and unauthorized transactions
              • Comply with legal obligations and enforce our Terms
              • Send marketing communications (with your consent)
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>3. Information Sharing</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We do not sell your personal information. We may share your information with:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Service Providers:</strong> Payment processors, shipping carriers, email providers, analytics services, and other vendors who perform services on our behalf. They are contractually obligated to protect your data.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred as part of the business.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Legal Requirements:</strong> When required by law, court order, or government request, or to protect our rights and safety.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>With Your Consent:</strong> For any other purpose with your explicit permission.
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>4. Data Security</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We implement appropriate technical and organizational measures to protect your personal information, including:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-line" }}>
              • SSL/TLS encryption for all data transmission
              • PCI DSS compliant payment processing (we never store full card numbers)
              • Regular security assessments and penetration testing
              • Access controls and employee training
              • Data minimization and retention policies
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>5. Your Rights and Choices</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Depending on your location, you may have the following rights:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-line" }}>
              • <strong>Access:</strong> Request a copy of your personal data
              • <strong>Rectification:</strong> Correct inaccurate or incomplete data
              • <strong>Erasure:</strong> Request deletion of your data (subject to legal obligations)
              • <strong>Restriction:</strong> Limit processing of your data
              • <strong>Portability:</strong> Receive your data in a structured, machine-readable format
              • <strong>Objection:</strong> Object to processing for marketing or legitimate interests
              • <strong>Withdraw Consent:</strong> Withdraw consent for marketing communications at any time
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              To exercise these rights, contact us at privacy@storefront.com. We'll respond within 30 days.
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>6. Cookies and Tracking Technologies</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We use cookies and similar technologies to:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-line" }}>
              • <strong>Essential:</strong> Enable core functionality (security, authentication, cart)
              • <strong>Performance:</strong> Analyze site usage and improve performance
              • <strong>Functionality:</strong> Remember preferences and enhance experience
              • <strong>Marketing:</strong> Deliver relevant ads and measure effectiveness (with consent)
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You can manage cookie preferences in your browser settings. Disabling essential cookies may break site functionality.
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>7. Third-Party Links</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Our Service may contain links to third-party websites. We are not responsible for the privacy practices of those sites. Please review their privacy policies.
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>8. Children's Privacy</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Our Service is not directed to children under 13 (or 16 in some jurisdictions). We do not knowingly collect personal information from children. If you believe we have collected data from a child, contact us immediately.
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>9. International Data Transfers</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Your information may be transferred to and processed in countries other than your own, including the United States. We ensure appropriate safeguards (Standard Contractual Clauses, adequacy decisions) for such transfers.
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>10. Data Retention</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We retain your personal information as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Account data is retained while your account is active and for a reasonable period thereafter.
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>11. Changes to This Policy</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We may update this Privacy Policy periodically. Changes will be posted on this page with a revised "Last updated" date. Material changes will be communicated via email or prominent notice on our Service.
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>12. Contact Us</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              If you have questions about this Privacy Policy or our data practices, contact us at:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              Storefront Privacy Team
              123 Commerce Street
              San Francisco, CA 94105
              Email: privacy@storefront.com
              Phone: 1-800-STOREFRONT
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Regional Disclosures</Typography>

          <Typography variant="h6" sx={{ mb: 1 }}>California Residents (CCPA/CPRA)</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            California residents have additional rights including the right to know what personal information is collected, the right to delete, the right to opt-out of sale, and the right to non-discrimination. We do not sell personal information.
          </Typography>

          <Typography variant="h6" sx={{ mb: 1, mt: 3 }}>European Residents (GDPR)</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            If you are in the EEA, UK, or Switzerland, you have rights under GDPR including access, rectification, erasure, restriction, portability, and objection. Our lawful bases for processing include contract performance, legitimate interests, and consent. You can lodge a complaint with a supervisory authority.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}