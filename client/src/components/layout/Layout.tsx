import { ReactNode } from "react";
import { Container, Box } from "@mui/material";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 2 }}>
        {children}
      </Box>
    </Container>
  );
};

export default Layout;