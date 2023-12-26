import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  Rating,
  Button,
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import LoadingBar from "./loadingBar";
import { SnackbarNotification } from "./SnackBarNotification";
import { Tooltip } from "@mui/material";

//cart redux imports
import { addToCartReducer, removeFromCartReducer } from "../redux/cartRedux";
import { useDispatch } from "react-redux";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";

function Product() {
  const { id } = useParams();
  const token = Cookies.get("token");
  const loggedInUserId = Cookies.get("userId");
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [addToCart, setAddToCart] = useState(false);
  const [removeFromCart, setRemoveFromCart] = useState(false);
  const [addToWishlist, setAddToWishlist] = useState(false);
  const [removeFromWishlist, setRemoveFromWishlist] = useState(false);
  const dispatch = useDispatch();

  async function handleAddToCart(e) {
    if (e.view.location.href) {
      let pid = String(e.view.location.href).split("/").pop();
      try {
        let payload = {
          payload: {
            event: "MANAGE_CART",
            data: {
              isRemove: false,
              productId: pid,
              qty: 1,
            },
          },
        };

        const res = await fetch(
          `${import.meta.env.VITE_API_PRODUCTS}/manageCart`,
          {
            method: "PATCH",
            headers: {
              authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) {
          throw "Unable to add item to the cart";
        }
        const data = await res.json();
        console.log(data);
        setRemoveFromCart(false);
        setAddToCart(true);
      } catch (error) {
        console.log(error);
        // setAddToCart(false);
      }
    }
  }

  async function handleRemoveFromCart(e) {
    if (e.view.location.href) {
      let pid = String(e.view.location.href).split("/").pop();
      try {
        let payload = {
          payload: {
            event: "MANAGE_CART",
            data: {
              isRemove: true,
              productId: pid,
              userId: loggedInUserId,
              qty: 1,
            },
          },
        };

        const res = await fetch(
          `${import.meta.env.VITE_API_PRODUCTS}/manageCart`,
          {
            method: "PATCH",
            headers: {
              authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) {
          throw "Unable to add item to the cart";
        }
        const data = await res.json();
        console.log(data, " is the add to cart response");
        setAddToCart(false);
        setRemoveFromCart(true);
      } catch (error) {
        console.log(error);
        setRemoveFromCart(false);
      }
    }
  }

  async function handleAddToWishlist(e) {
    console.log("Adding to wishlist");
    if (e.view.location.href) {
      let pid = String(e.view.location.href).split("/").pop();
      try {
        let payload = {
          payload: {
            event: "MANAGE_WISHLIST",
            data: {
              isRemove: false,
              productId: pid,
            },
          },
        };

        const res = await fetch(
          `${import.meta.env.VITE_API_PRODUCTS}/manageWishlist`,
          {
            method: "PATCH",
            headers: {
              authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) {
          throw "Unable to add item to the cart";
        }
        const data = await res.json();
        console.log(data, " is the response from add to wishlist");
        setRemoveFromWishlist(false);
        setAddToWishlist(true);
      } catch (error) {
        console.log(error);
        // setAddToCart(false);
      }
    }
  }

  async function handleRemoveFromWishlist(e) {
    console.log("Removing from wishlist");
    if (e.view.location.href) {
      let pid = String(e.view.location.href).split("/").pop();
      try {
        let payload = {
          payload: {
            event: "MANAGE_WISHLIST",
            data: {
              isRemove: true,
              productId: pid,
              qty: 1,
            },
          },
        };

        const res = await fetch(
          `${import.meta.env.VITE_API_PRODUCTS}/manageWishlist`,
          {
            method: "PATCH",
            headers: {
              authorization: token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) {
          throw "Unable to remove item from the cart";
        }
        const data = await res.json();
        console.log(data);
        setRemoveFromWishlist(true);
        setAddToWishlist(false);
      } catch (error) {
        console.log(error);
        // setAddToCart(false);
      }
    }
  }

  const getItemById = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_API_PRODUCTS}/${id}`, {
      method: "GET",
      headers: {
        authorization: token,
      },
    });

    const data = await res.json();
    console.log(data, " is the recieved data");
    setProduct(data.data);
    setLoading(false);
  };

  useEffect(() => {
    {
      token && getItemById(id);
    }
  }, []);

  useEffect(() => {
    if (addToCart) {
      dispatch(addToCartReducer(product));
      setAddToCart(false);
    } else if (removeFromCart) {
      dispatch(removeFromCartReducer(product));
      setRemoveFromCart(false);
    }
  }, [addToCart, removeFromCart]);

  return (
    <Container
      sx={{
        marginTop: "50px",
      }}
    >
      {loading ? (
        <LoadingBar />
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <Card sx={{ width: "40%" }} variant="outlined">
              <div className="product-image">
                <img
                  className="product-thumbnail"
                  src={product.thumbnail}
                  alt=""
                />
              </div>
            </Card>
            <Card sx={{ marginLeft: "10px", width: "50%" }} variant="outlined">
              <Card className="product-title">
                <Typography variant="h6">{product.title}</Typography>
              </Card>
              <Card className="product-brand">
                <Typography variant="body2">
                  Visit the {product.brand}
                </Typography>
              </Card>
              <Card className="product-ratings-reviews">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div className="rating-num">{product.rating}</div>
                  <div className="rating-star">
                    {
                      <Rating
                        name="read-only"
                        value={product.rating}
                        precision={0.1}
                        readOnly
                      />
                    }
                  </div>
                  <div className="count-rating">
                    {product.countOfRating} ratings
                  </div>
                </Box>
              </Card>
              <Card className="bought-stats">
                {product.countOfBought && (
                  <Typography>
                    {product.countOfBought}+ bought in last month
                  </Typography>
                )}
              </Card>
              <Card sx={{ marginTop: "15px" }} className="price-box">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{ color: "red", marginRight: "10px", fontWeight: "15" }}
                    variant="h5"
                  >
                    -{product.discount}%
                  </Typography>
                  <Typography variant="h6">
                    ₹{product.availablePrice}
                  </Typography>
                </Box>
                <div className="mrp-box">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2">M.R.P: </Typography>
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: "line-through" }}
                    >
                      {" "}
                      {product.mrp}
                    </Typography>
                  </Box>
                </div>
                <Typography variant="body2">Inclusive of all taxes</Typography>
              </Card>
              <Card sx={{ marginTop: "20px" }} className="specification">
                <Typography variant="body2">
                  SecureGuard Pro is an advanced smart home security system
                  designed to provide comprehensive protection and peace of mind
                  for homeowners. This cutting-edge system integrates
                  state-of-the-art technology to offer a robust and
                  user-friendly solution for securing residential spaces.
                </Typography>
              </Card>
              <Card
                sx={{ margin: "5px", padding: "5px", alignItems: "center" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={(e) => handleAddToCart(e)}
                    sx={{
                      borderRadius: "5px",
                      color: "Black",
                      backgroundColor: "orange",
                      ":hover": {
                        color: "black",
                        backgroundColor: "orange",
                      },
                    }}
                    variant="contained"
                  >
                    <Tooltip title="Add To Cart">
                      <AddShoppingCartIcon></AddShoppingCartIcon>
                    </Tooltip>
                  </Button>
                  <Button
                    onClick={(e) => handleRemoveFromCart(e)}
                    sx={{
                      marginLeft: "5px",
                      borderRadius: "5px",
                      color: "white",
                      backgroundColor: "red",
                      ":hover": {
                        color: "white",
                        backgroundColor: "red",
                      },
                    }}
                    variant="contained"
                  >
                    <Tooltip title="Remove From Cart">
                      <RemoveShoppingCartIcon></RemoveShoppingCartIcon>
                    </Tooltip>
                  </Button>
                  <Button
                    onClick={(e) => handleAddToWishlist(e)}
                    sx={{
                      marginLeft: "5px",
                      borderRadius: "5px",
                      color: "white",
                      backgroundColor: "#349eeb",
                      ":hover": {
                        color: "white",
                        backgroundColor: "#349eeb",
                      },
                    }}
                    variant="contained"
                  >
                    <Tooltip title="Add To Wishlist">
                      <PlaylistAddIcon></PlaylistAddIcon>
                    </Tooltip>
                  </Button>
                  <Button
                    onClick={(e) => handleRemoveFromWishlist(e)}
                    sx={{
                      marginLeft: "5px",
                      borderRadius: "5px",
                      color: "white",
                      backgroundColor: "red",
                      ":hover": {
                        color: "white",
                        backgroundColor: "red",
                      },
                    }}
                    variant="contained"
                  >
                    <Tooltip title="Remove From Wishlist">
                      <PlaylistRemoveIcon></PlaylistRemoveIcon>
                    </Tooltip>
                  </Button>
                </Box>
              </Card>
            </Card>
          </Box>
        </>
      )}
      {addToCart && <SnackbarNotification message={"Item Added To Cart"} />}
      {removeFromCart && (
        <SnackbarNotification message={"Item Removed From Cart"} />
      )}
    </Container>
  );
}

const MemoziedProduct = React.memo(Product);
export default MemoziedProduct;
