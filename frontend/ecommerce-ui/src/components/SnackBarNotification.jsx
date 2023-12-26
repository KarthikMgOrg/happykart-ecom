/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";

export function SnackbarNotification({ message }) {
  const [open, setOpen] = useState(true);
  setTimeout(() => {
    setOpen(false);
  }, 3000);
  const vertical = "top";
  const horizontal = "center";
  return (
    <Box sx={{ width: 500 }}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        message={message}
        key={vertical + horizontal}
      />
    </Box>
  );
}
