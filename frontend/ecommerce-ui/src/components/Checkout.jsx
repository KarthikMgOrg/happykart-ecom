import { Container, Typography, Card, Box, Button } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import LoadingBar from "../components/loadingBar";
import OrderPlaced from "./OrderPlaced";
import { useNavigate } from "react-router-dom";
import { clearCartReducer } from "../redux/cartRedux";
import { useDispatch } from "react-redux";

function Checkout() {
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  let cartSubTotal = 0;
  const dispatch = useDispatch();

  const getCheckoutItems = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_CUSTOMERS}/cart`, {
      method: "GET",
      headers: {
        authorization: token,
      },
    });
    const data = await res.json();
    console.log(data, " is fetch response");
    setCheckoutItems(data);
  };

  const placeOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_SHOPPING}/createOrder`,
        {
          method: "POST",
          headers: {
            authorization: token,
          },
        }
      );
      const data = await res.json();
      console.log(data, " is the placed order");
      setLoading(false);
      setOrderId(data.orderId);
      dispatch(clearCartReducer());
      navigate("/");
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    {
      token && getCheckoutItems();
    }
  }, []);

  return (
    <Container
      sx={{
        marginTop: "20px",
      }}
    >
      {loading && <LoadingBar />}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5">Checkoutpage</Typography>
      </Box>
      {checkoutItems.data && checkoutItems.data.length > 0 ? (
        checkoutItems.data.map((item, index) => {
          const itemTotal = item.qty * item.availablePrice;
          cartSubTotal += itemTotal;
          return (
            <Card
              className="cart-card-container"
              variant="outlined"
              key={index}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Card
                  variant="outlined"
                  elevation={0}
                  className="cart-card-item"
                >
                  <img
                    style={{
                      height: "100px",
                      width: "100px",
                      objectFit: "cover",
                    }}
                    src={item.thumbnail}
                  ></img>
                </Card>
                <Card
                  variant="outlined"
                  elevation={0}
                  className="cart-card-item"
                >
                  <Box sx={{ display: "flex" }}>
                    <Typography variant="h6">{item.title}</Typography>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "20px",
                      }}
                    >
                      <Typography fontWeight="bold" variant="subtitle2">
                        ₹
                      </Typography>
                      <Typography fontWeight="bold" variant="subtitle2">
                        {item.availablePrice}
                      </Typography>
                    </div>
                  </Box>
                  <Typography variant="subtitle1">M.R.P: {item.mrp}</Typography>
                  <Typography variant="subtitle1">
                    From: {item.brand}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="subtitle1">
                      Quantity: {item.qty}
                    </Typography>
                    <Typography variant="subtitle2">
                      Subtotal: {itemTotal}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            </Card>
          );
        })
      ) : (
        <Typography sx={{ marginTop: "20px" }} variant="h6">
          Start Adding Items To Cart
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4">Total: {cartSubTotal}</Typography>
        <Button onClick={placeOrder} className="place-order">
          <Typography
            sx={{
              color: "black",
              backgroundColor: "orange",
              padding: "10px",
              borderRadius: "5px",
            }}
            variant="subtitle1"
          >
            Place Order
          </Typography>
        </Button>
      </Box>
      {/* {orderId && (
        // Render another component after the placeOrder function returns a response
        <OrderPlaced orderId={orderId} />
      )} */}
    </Container>
  );
}

const MemoziedCheckout = React.memo(Checkout);

export default MemoziedCheckout;
