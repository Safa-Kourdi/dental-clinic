import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Cairo", sans-serif',
  },
  palette: {
    primary: { main: "#0891b2", dark: "#0e7490" },
    error: { main: "#dc2626" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          padding: "8px 22px",
          boxShadow: "none",
        },
      },
    },
  },
});

export default theme;
