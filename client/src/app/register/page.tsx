import { Container, Box, Typography, TextField, Button, Stack, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { register } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(register({ name, email, password })).unwrap()
      .then(() => navigate("/login"))
      .catch((err: any) => {
        // Error handled in slice
      });
  };

  return (
    <Container sx={{ py: 8, px: 1, maxWidth: 400, margin: "0 auto" }}>
      <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "80vh" }}>
        <Box sx={{ width: "100%" }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
            Register
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
            Create your account
          </Typography>

          <Box sx={{ mb: 3 }}>
            <form onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
                Register
              </Button>
            </form>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
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

export default RegisterPage;