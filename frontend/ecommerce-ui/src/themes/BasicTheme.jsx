import { createTheme } from "@mui/material";

export const basicTheme = createTheme({
  components: {
    MuiTypography: {
      variants: {
        props: {
          variant: "caption",
        },
        style: {
          color: "yellow",
        },
      },
    },
  },
});
