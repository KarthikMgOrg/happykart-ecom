import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";
import Typography from "@mui/material/Typography";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const token = Cookies.get("token");

  const getWishlist = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_CUSTOMERS}/wishlist`, {
      method: "GET",
      headers: {
        authorization: token,
      },
    });
    const data = await res.json();
    console.log(data, " is fetch response");
    setWishlist(data);
  };
  useEffect(() => {
    token && getWishlist();
  }, []);

  return (
    <Container
      sx={{
        marginTop: "50px",
      }}
    >
      <Typography variant="h4">Wishlist</Typography>
      {wishlist.data && wishlist.data.length > 0 ? (
        wishlist.data.map((item, index) => {
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
                  ></Box>
                </Card>
              </Box>
            </Card>
          );
        })
      ) : (
        <Typography sx={{ marginTop: "20px" }} variant="h6">
          Start Adding Items To Wishlist
        </Typography>
      )}
    </Container>
  );
}

const MemoziedWishlist = React.memo(Wishlist);
export default MemoziedWishlist;
