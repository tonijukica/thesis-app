import { createMuiTheme } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#234353",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
      dark: red.A700,
    },
    background: {
      default: "#fff",
    },
  },
});

export default theme;
