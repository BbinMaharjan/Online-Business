"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/products" },
  { label: "Contact", href: "/contact" },
];

function Header() {
  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar sx={{ position: "relative" }}>
        {/* Left: icon + title */}
        <Box
          component={Link}
          href="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="logo"
            disableRipple
          >
            <StorefrontIcon />
          </IconButton>
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            MyApp
          </Typography>
        </Box>

        {/* Center: nav links */}
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 1,
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item.label}
              component={Link}
              href={item.href}
              color="inherit"
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
