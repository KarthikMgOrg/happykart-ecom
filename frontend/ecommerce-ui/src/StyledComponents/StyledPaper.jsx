import Paper from "@mui/material/Paper";
import { styled } from "@mui/system";

export const StyledPaper = styled(Paper)({
  padding: 16,
  height: 588,
  width: 272,
  textAlign: "center",
  color: "black",
  transition: "transform 0.4s",

  "&:hover": {
    transform: "scale(1.01)", // Example: Enlarge the component on hover
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)", // Example: Add a shadow on hover
    cursor: "pointer",
  },
});
