"use client";

import React from "react";
import {
  Box,
  Typography,
  Rating,
  Stack,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import type { Product } from "@/types";

interface ProductDetailsProps {
  product: Product;
}

const tabLabels = ["Description", "Specifications", "Shipping & Returns", "Reviews"];

export function ProductDetails({ product }: ProductDetailsProps) {
  const [tab, setTab] = React.useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  const renderTabPanel = (index: number) => {
    if (tab !== index) return null;

    switch (index) {
      case 0:
        return (
          <Box sx={{ py: 3 }}>
            <Typography variant="body1" sx={{ lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {product.description || "No description available."}
            </Typography>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ py: 3 }}>
            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <Box key={key} sx={{ display: "flex", justifyContent: "space-between", py: 1, borderBottom: 1, borderColor: "divider" }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {key}
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: "right" }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No specifications available for this product.
              </Typography>
            )}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ py: 3 }}>
            <Stack direction="column" spacing={3}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ "& .MuiAccordionSummary-content": { margin: 0 } }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Shipping Information
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack direction="column" spacing={2}>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Standard Shipping"
                        secondary="5-7 business days. Free on orders over $50."
                      />
                    </ListItem>
                    <Divider variant="inset" />
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Express Shipping"
                        secondary="2-3 business days. Additional charges apply."
                      />
                    </ListItem>
                    <Divider variant="inset" />
                    <ListItem disablePadding>
                      <ListItemText
                        primary="International Shipping"
                        secondary="7-14 business days. Customs fees may apply."
                      />
                    </ListItem>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ "& .MuiAccordionSummary-content": { margin: 0 } }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Returns & Exchanges
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack direction="column" spacing={2}>
                    <ListItem disablePadding>
                      <ListItemText
                        primary="30-Day Return Policy"
                        secondary="Items must be unused, in original packaging, with tags attached."
                      />
                    </ListItem>
                    <Divider variant="inset" />
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Free Return Shipping"
                        secondary="On eligible items within 30 days of delivery."
                      />
                    </ListItem>
                    <Divider variant="inset" />
                    <ListItem disablePadding>
                      <ListItemText
                        primary="Refund Method"
                        secondary="Original payment method. Processing takes 5-10 business days."
                      />
                    </ListItem>
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ "& .MuiAccordionSummary-content": { margin: 0 } }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Warranty
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    This product comes with a manufacturer's warranty. Please refer to the documentation included with your purchase for specific warranty terms and conditions.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ py: 3 }}>
            {product.reviews && product.reviews.length > 0 ? (
              <Stack direction="column" spacing={3}>
                {product.reviews.map((review) => (
                  <Box
                    key={review._id}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Rating name={`review-${review._id}`} value={review.rating} size="small" readOnly precision={0.5} />
                        <Typography variant="subtitle2" fontWeight={600}>
                          {review.userName}
                        </Typography>
                        {review.verifiedPurchase && (
                          <Chip label="Verified Purchase" size="small" color="success" variant="outlined" />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                    {review.title && (
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                        {review.title}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {review.comment}
                    </Typography>
                    {review.images && review.images.length > 0 && (
                      <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {review.images.map((img, idx) => (
                          <Box key={idx} sx={{ width: 80, height: 80, borderRadius: 1, overflow: "hidden" }}>
                            <img src={img} alt={`Review image ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No reviews yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Be the first to review this product!
                </Typography>
                <Button variant="contained" href="#write-review" component="a">
                  Write a Review
                </Button>
              </Box>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ pt: 3 }}>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="standard"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          minHeight: 48,
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            minHeight: 48,
            px: 2,
            "&.Mui-selected": {
              color: "primary.main",
            },
          },
          "& .MuiTabs-indicator": {
            height: 3,
            borderRadius: "3px 3px 0 0",
          },
        }}
      >
        {tabLabels.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>

      {tabLabels.map((_, index) => renderTabPanel(index))}
    </Box>
  );
}

export default ProductDetails;