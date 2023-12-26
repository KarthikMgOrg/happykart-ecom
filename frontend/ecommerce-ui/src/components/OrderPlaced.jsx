import { Box, Container, Grid, Typography } from "@mui/material";
import orderPlaced from "../assets/order_placed.png";

export default function OrderPlaced(orderId) {
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <img
          style={{ height: "300px", width: "300px" }}
          src={orderPlaced}
          alt=""
        />
      </Box>
      <Grid sx={{ marginLeft: "35%", marginTop: "20px" }} container spacing={2}>
        <Grid xs={12}>
          <Typography variant="h4">Order Placed Successfully!</Typography>
          <Typography variant="subtitle2">
            Here is your OrderID: ${orderId}
          </Typography>
          <Typography variant="subtitle2">
            Thank you for Shopping with us!
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
