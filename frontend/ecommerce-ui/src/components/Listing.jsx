/* eslint-disable react/prop-types */
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import "../App.css";

//styled components
import { StyledPaper } from "../StyledComponents/StyledPaper";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import LoadingBar from "./loadingBar";

// export default function GridComponent({ items }) {
//   return (
//     <Grid container spacing={2}>
//       {items.map((name, index) => (
//         <Grid item key={index} xs={3}>
//           <StyledPaper>
//             <img
//               className="grid-item-image"
//               src="https://m.media-amazon.com/images/I/61jZrJjs42L._AC_UL320_.jpg"
//               alt=""
//             />
//             <Typography variant="button" gutterBottom>
//               Seiko
//             </Typography>
//             <Typography variant="subtitle1" gutterBottom>
//               Analog Blue Dial Mens Watch-SNKP17K1
//             </Typography>
//             <Rating name="read-only" value={4.5} precision={0.5} readOnly />
//             <Typography variant="caption" display="block" gutterBottom>
//               50+ bought in past month
//             </Typography>
//             <Typography variant="h5">₹14,850</Typography>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Typography className="strike-through" variant="caption">
//                 M.R.P ₹16,850
//               </Typography>
//               <Typography variant="caption">(10% off)</Typography>
//             </Box>

//             <Typography variant="caption" display="block" gutterBottom>
//               Save extra with No Cost EMI
//             </Typography>
//           </StyledPaper>
//         </Grid>
//       ))}
//     </Grid>
//   );
// }

function ProductListing() {
  const token = Cookies.get("token");

  //states
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const fetchData = async () => {
    console.log(`${import.meta.env.VITE_API_PRODUCTS}`, " is the list api");
    const res = await fetch(`${import.meta.env.VITE_API_PRODUCTS}`, {
      method: "GET",
      headers: {
        authorization: token,
      },
    });
    const data = await res.json();
    console.log(data, " is fetch response");
    setItems(data.data);
    setLoading(false);
  };

  useEffect(() => {
    token && fetchData();
  }, [token]);

  return (
    <Container className="product-grid">
      {loading ? (
        <LoadingBar />
      ) : (
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Link to={`/products/${item._id}`} key={index}>
              <Grid item xs={3}>
                <StyledPaper>
                  <div className="image-container">
                    <img src={item.thumbnail} alt="" />
                  </div>
                  <Typography variant="button" gutterBottom>
                    {item.brand}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {item.title}
                  </Typography>
                  <Rating
                    name="read-only"
                    value={item.rating}
                    precision={0.1}
                    readOnly
                  />
                  <Typography variant="caption" display="block" gutterBottom>
                    {item.countOfBought}+ bought in past month
                  </Typography>
                  <Typography variant="h5">₹{item.availablePrice}</Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography className="strike-through" variant="caption">
                      M.R.P ₹{item.mrp}
                    </Typography>
                    <Typography variant="caption">
                      ({item.discount}% off)
                    </Typography>
                  </Box>

                  <Typography variant="caption" display="block" gutterBottom>
                    {item.noCostEmi}
                  </Typography>
                </StyledPaper>
              </Grid>
            </Link>
          ))}
        </Grid>
      )}
    </Container>
  );
}

const MemoziedProductListing = React.memo(ProductListing);
export default MemoziedProductListing;
