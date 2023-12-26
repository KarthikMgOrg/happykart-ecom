import React, { useEffect } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCartReducer } from "../redux/cartRedux";

//cart redux related imports

function Cart() {
  // const [cart, setCart] = useState([]);
  const token = Cookies.get("token");
  const { cartItems, total } = useSelector((state) => state.cartRedux);
  const dispatch = useDispatch();
  // let cartSubTotal = 0;

  const getCart = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_CUSTOMERS}/cart`, {
      method: "GET",
      headers: {
        authorization: token,
      },
    });
    const data = await res.json();
    console.log(data, " is fetch response");
    // console.log(cartItems, " is the present cart items");
    if (cartItems.length < 1) {
      dispatch(updateCartReducer(data.data));
    }
  };

  useEffect(() => {
    token && getCart();
  }, []);

  return (
    <Container
      sx={{
        marginTop: "50px",
      }}
    >
      <Typography variant="h4">Shopping Cart</Typography>
      {/* <Typography variant="subtitle2">
        Current increment value: {value}
      </Typography> */}
      {cartItems && cartItems.length > 0 ? (
        cartItems.map((item, index) => {
          // const itemTotal = item.qty * item.availablePrice;
          // cartSubTotal += itemTotal;
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
                      Quantity: {item.qty || item.quantity}
                    </Typography>
                    {/* <Typography variant="subtitle2">
                      Subtotal: {total}
                    </Typography> */}
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
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button>
          <Typography variant="subtitle2">
            <Link to={"/checkout"}>Proceed to Checkout</Link>
          </Typography>
        </Button>
        <div className="cart-subtotal">
          <Typography variant="h6">GrandTotal: {total}</Typography>
        </div>
      </Box>
    </Container>
  );
}

const MemoziedCart = React.memo(Cart);
export default MemoziedCart;
