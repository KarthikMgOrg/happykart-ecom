import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Cookies from "js-cookie";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function Orders() {
  const [orders, setOrders] = useState([]);
  const token = Cookies.get("token");
  let cartSubTotal = 0;

  const getOrders = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_SHOPPING}/getOrders`, {
      method: "GET",
      headers: {
        authorization: token,
      },
    });
    const data = await res.json();
    console.log(data, " is fetch response");
    setOrders(data);
  };

  function formattedDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return formattedDate;
  }

  useEffect(() => {
    token && getOrders();
  }, []);

  return (
    <Container
      sx={{
        marginTop: "50px",
      }}
    >
      <Typography variant="h4">Your Orders</Typography>
      {orders.data &&
        orders.data.map((item, index) => {
          {
            console.log(item);
          }
          const itemTotal = item.qty * item.availablePrice;
          cartSubTotal += itemTotal;
          return (
            <Card className="order-card-main" variant="outlined" key={index}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Container className="order-overview-details">
                    <Typography variant="body2">ORDER PLACED</Typography>
                    <Typography variant="body2">
                      {formattedDate(item.createdAt)}
                    </Typography>
                  </Container>
                </div>
                <div>
                  <Typography variant="body2">TOTAL</Typography>
                  <Typography variant="body2">₹{item.amount}</Typography>
                </div>
                <div>
                  <Typography variant="body2">ORDER#</Typography>
                  <Typography variant="body2">{item.orderId}</Typography>
                </div>
              </Box>

              {item.items.map((item, index) => {
                {
                  console.log(item);
                }
                return (
                  <Card className="orders-item" variant="outlined" key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <img
                        style={{
                          height: "100px",
                          width: "100px",
                        }}
                        src={item.thumbnail}
                      ></img>
                      <Typography variant="subtitle2"> {item.title}</Typography>
                    </Box>
                  </Card>
                );
              })}
            </Card>
          );
        })}
    </Container>
  );
}

const MemoziedOrder = React.memo(Orders);
export default MemoziedOrder;
