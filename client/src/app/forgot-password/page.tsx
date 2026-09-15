import { Container, Box, Typography, TextField, Button, Stack, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement forgot password flow
    // dispatch(forgotPassword({ email }));
    alert("Password reset instructions sent to your email");
    navigate("/login");
  };

  return (
    <Container sx={{ py: 8, px: 1, maxWidth: 400, margin: "0 auto" }}>
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "80vh" }}>
        <Box sx={{ width: "100%" }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
            Forgot Password
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
            Enter your email address to receive password reset instructions
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
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mb: 3, marginTop: 1 }}
              >
                Send Reset Link
              </Button>
            </form>
          </Box>

          <Box sx={{ textAlign: "center" mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Remember your password?{" "}
              <a href="/login" style={{ color: "#1890ff", textDecoration: "underline" }}>
                Login
              </a>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
};

export default ForgotPasswordPage;