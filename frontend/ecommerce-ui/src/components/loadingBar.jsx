import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import React from "react";

function LoadingBar() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress></CircularProgress>
    </Box>
  );
}

const MemoziedLoadingBar = React.memo(LoadingBar);

export default MemoziedLoadingBar;
