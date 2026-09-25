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
            <Typography variant="body2" color="text.secondary">
              No specifications available for this product.
            </Typography>
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
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
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
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
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
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
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