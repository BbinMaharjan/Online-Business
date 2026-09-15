import { ReactNode } from "react";
import { Container } from "@mui/material";
import { Box } from "@mui/material";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Container maxWidth="lg">
      <Box py={2}>
        {children}
      </Box>
    </Container>
  );
};

export default Layout;