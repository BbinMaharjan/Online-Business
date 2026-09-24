"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
  InputBase,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ShoppingCart as CartIcon,
  Favorite as WishlistIcon,
  Search as SearchIcon,
  Person as AccountIcon,
  Close,
  ExpandMore,
  ChevronLeft,
} from "@mui/icons-material";
import { useCart } from "@/services/api/cart";
import { useWishlist } from "@/services/api/wishlist";
import { useUser } from "@/services/api/auth";
import { SearchBox } from "@/components/navigation/SearchBox";

interface HeaderProps {
  onMobileMenuOpen?: () => void;
}

export function Header({ onMobileMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();
  const { data: userData, isLoading: userLoading } = useUser();

  const user = userData?.data;
  const cartCount = cart?.data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const wishlistCount = wishlist?.data?.length || 0;

  const handleDrawerToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (onMobileMenuOpen) onMobileMenuOpen();
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleSearchFocus = () => {
    if (isMobile || isTablet) {
      setSearchOpen(true);
    }
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const navigation = [
    { name: "Shop", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Brands", href: "/brands" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const userMenuItems = user
    ? [
        { label: "My Account", href: "/account", icon: AccountIcon },
        { label: "Orders", href: "/account/orders", icon: "order" },
        { label: "Addresses", href: "/account/addresses", icon: "location" },
        { label: "Wishlist", href: "/account/wishlist", icon: WishlistIcon },
        { label: "Reviews", href: "/account/reviews", icon: "rate" },
        { type: "divider" as const },
        { label: "Logout", action: "logout", icon: "logout" },
      ]
    : [
        { label: "Login", href: "/login", icon: AccountIcon },
        { label: "Register", href: "/register", icon: "person_add" },
      ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 64, gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open menu"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Link href="/" passHref style={{ textDecoration: "none", color: "inherit" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
                Storefront
              </Typography>
            </Link>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              maxWidth: 720,
              mx: { xs: 0, md: 4 },
            }}
          >
            <SearchBox
              inputRef={searchInputRef}
              onFocus={handleSearchFocus}
              placeholder="Search products, brands, categories..."
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ display: { xs: "none", sm: "flex" }, position: "relative" }}>
              <Link href="/account/wishlist" passHref>
                <IconButton
                  color="inherit"
                  aria-label="Wishlist"
                  sx={{ position: "relative" }}
                >
                  <WishlistIcon fontSize="medium" />
                  {wishlistCount > 0 && (
                    <Badge
                      badgeContent={wishlistCount > 99 ? "99+" : wishlistCount}
                      color="error"
                      overlap="circular"
                      anchorOrigin={{ vertical: "top", horizontal: "right" }}
                      sx={{ top: -4, right: -4 }}
                    />
                  )}
                </IconButton>
              </Link>
            </Box>

            <Box sx={{ position: "relative" }}>
              <Link href="/cart" passHref>
                <IconButton
                  color="inherit"
                  aria-label="Shopping Cart"
                  sx={{ position: "relative" }}
                >
                  <CartIcon fontSize="medium" />
                  {cartCount > 0 && (
                    <Badge
                      badgeContent={cartCount > 99 ? "99+" : cartCount}
                      color="primary"
                      overlap="circular"
                      anchorOrigin={{ vertical: "top", horizontal: "right" }}
                      sx={{ top: -4, right: -4 }}
                    />
                  )}
                </IconButton>
              </Link>
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" }, ml: 1 }}>
              <IconButton
                color="inherit"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <SearchIcon />
              </IconButton>
            </Box>

            {userLoading ? (
              <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2, width: 40, height: 40 }}>
                <Avatar variant="rounded" sx={{ width: "100%", height: "100%" }}>
                  <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="MuiSkeleton-root" style={{ width: 24, height: 24, borderRadius: "50%" }} />
                  </Box>
                </Avatar>
              </Box>
            ) : (
              <Box sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}>
                <IconButton
                  onClick={handleUserMenuOpen}
                  onClose={handleUserMenuClose}
                  aria-controls={userMenuAnchor ? "user-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={!!userMenuAnchor}
                  color="inherit"
                  sx={{ minWidth: 40, height: 40, borderRadius: "50%", p: 0 }}
                >
                  <Avatar
                    sx={{ width: 36, height: 36, fontSize: "0.875rem", fontWeight: 600 }}
                    src={user?.image}
                    alt={user?.name || "User"}
                  >
                    {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                </IconButton>
              </Box>
            )}

            {isMobile && !userLoading && !user && (
              <Box sx={{ display: { xs: "flex", md: "none" }, ml: 1 }}>
                <Button
                  size="small"
                  component={Link}
                  href="/login"
                  passHref
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Login
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>

        {searchOpen && (
          <Toolbar variant="dense" sx={{ px: 2, pb: 2, pt: 0, backgroundColor: "background.paper" }}>
            <SearchBox
              inputRef={searchInputRef}
              onFocus={handleSearchFocus}
              onClose={handleSearchClose}
              placeholder="Search products, brands, categories..."
              autoFocus
            />
          </Toolbar>
        )}
      </AppBar>

      <Menu
        anchorEl={userMenuAnchor}
        open={!!userMenuAnchor}
        onClose={handleUserMenuClose}
        id="user-menu"
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: { minWidth: 240, mt: 1, borderRadius: 2, boxShadow: 3 },
        }}
      >
        {user && (
          <>
            <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </>
        )}
        {userMenuItems.map((item, index) => {
          if (item.type === "divider") return <Divider key={`divider-${index}`} />;
          return (
            <MenuItem
              key={index}
              component={Link}
              href={item.href}
              passHref
              onClick={handleUserMenuClose}
              disableGutters
            >
              <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
                {typeof item.icon === "function" ? React.createElement(item.icon, { fontSize: "small" }) : item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </MenuItem>
          );
        })}
      </Menu>

      <Drawer
        variant="temporary"
        open={mobileMenuOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          drawer: { width: 280, boxSizing: "border-box" },
          paper: { width: 280, boxSizing: "border-box", borderRight: "1px solid", borderColor: "divider" },
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={handleDrawerToggle} aria-label="close menu">
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <List component="nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <ListItem
              key={item.name}
              button
              component={Link}
              href={item.href}
              passHref
              onClick={handleDrawerToggle}
              selected={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
              sx={{
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { backgroundColor: "primary.dark" },
                  "& .MuiListItemIcon-root": { color: "primary.contrastText" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.name === "Shop" && <SearchIcon />}
                {item.name === "Categories" && <AccountIcon />}
                {item.name === "Brands" && <WishlistIcon />}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List component="nav" aria-label="User navigation">
          {userMenuItems.map((item, index) => {
            if (item.type === "divider") return <Divider key={`user-divider-${index}`} />;
            return (
              <ListItem
                key={index}
                button
                component={Link}
                href={item.href}
                passHref
                onClick={handleDrawerToggle}
                disableGutters
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {typeof item.icon === "function" ? React.createElement(item.icon, { fontSize: "small" }) : item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}

export default Header;