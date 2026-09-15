import { Container, Box, Typography, TextField, Button, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/auth/authSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { selectAuthUser } from "../../features/auth/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);

  // If already logged in, redirect to account dashboard
  useEffect(() => {
    if (user) {
      navigate("/account", { replace: true });
    }
  }, [user]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password })).unwrap()
      .then(() => navigate("/account"))
      .catch((err: any) => {
        // Error handled in slice
      });
  };

  return (
    <Container sx={{ py: 8, px: 1, maxWidth: 400, margin: "0 auto" }}>
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "80vh" }}>
        <Box sx={{ width: "100%" }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
            Login
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
            Sign in to your account
          </Typography>

          <Box sx={{ mb: 3 }}>
            <form onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                obscureText
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mb: 3, marginTop: 1 }}
              >
                Login
              </Button>
            </form>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <a href="/register" style={{ color: "#1890ff", textDecoration: "underline" }}>
                Register
              </a>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
};

export default LoginPage;