import { AppBar, Toolbar, IconButton, Box, CssBaseline } from "@mui/material";
import { Menu as MenuIcon, ShoppingCart as CartIcon, Favorites as WishlistIcon } from "@mui/icons-material";
import { Link } from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { selectCart } from "../../features/cart/cartSlice";
import { useDispatch } from "react-redux";
import { selectCartItems } from "../../features/cart/cartSlice";

interface HeaderProps {
  user?: any;
}

const Header = ({ user }: HeaderProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: () => fetch("/api/cart", { credentials: "include" }).then((res) => res.json()),
    enabled: !!user,
  });

  const cartCount = cartData?.data?.items?.length || 0;

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleCart = () => {
    navigate("/cart");
  };

  const handleWishlist = () => {
    navigate("/account/wishlist");
  };

  return (
    <CssBaseline />
    <AppBar position="sticky" sx={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Link href="/" passHref>
            <a style={{ textDecoration: "none", color: "inherit" }}>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Storefront</a>
          </Link>
        </Box>

        <Box sx={{ flexGrow: 1, display: "none", justifyContent: "flex-end" }}>
          {/* Desktop navigation links would go here */}
        </Box>

        <Box sx={{ display: { sm: "block", md: "none" }, mx: 2 }}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => {}}>
            <MenuIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: { sm: "none", md: "block" }, mr: 2 }}>
          <Link href="/cart" passHref>
            <a style={{ textDecoration: "none" }}>
              <ShoppingCartIcon fontSize="small" />
              {cartCount > 0 ? (
                <Badge
                  color="primary"
                  variant="contained"
                  sx={{ position: "absolute", right: 8, top: 8, minWidth: 20, height: 20, fontSize: 12 }>
                    {cartCount}
                  </Badge>
                ) : null}
              </a>
          </Link>
        </Box>

        <Box sx={{ display: { sm: "none", md: "block" }, mr: 2 }}>
          <Link href="/account/wishlist" passHref>
            <a style={{ textDecoration: "none" }}>
              <WishlistIcon fontSize="small" />
            </a>
          </Link>
        </Box>

        {user ? (
          <Box sx={{ display: { sm: "block", md: "none" }, mr: 2 }}>
            <Link href="/account/profile" passHref>
              <a style={{ textDecoration: "none" }}>
                {user.name?.split(" ")[0]?.charAt(0) || "U"}
              </a>
            </Link>
          </Box>
        ) : (
          <>
            <Link href="/login" passHref>
              <a style={{ textDecoration: "none", ml: 2 }}>Login</a>
            </Link>
            <Link href="/register" passHref>
              <a style={{ textDecoration: "none", ml: 2 }}>Register</a>
            </Link>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;