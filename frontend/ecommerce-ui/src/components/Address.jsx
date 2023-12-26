import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

function Address() {
  const token = Cookies.get("token");

  const [address, setAddress] = useState();
  const [currentAddress, setCurrentAddress] = useState({
    street: "",
    state: "",
    city: "",
  });

  const handleButtonClick = async () => {
    let street = document.getElementById("street-name").value;
    let city = document.getElementById("city-name").value;
    let state = document.getElementById("state-name").value;

    const address = { street, city, state };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_CUSTOMERS}/updateAddress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify(address),
        }
      );

      const data = await res.json();
      setAddress(data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getCurrentAddress = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_CUSTOMERS}/address`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      });
      const data = await res.json();
      console.log(data, " is the current address");
      setCurrentAddress(data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    {
      token && getCurrentAddress();
    }
  }, []);

  useEffect(() => {
    setCurrentAddress(address);
  }, [address]);

  return (
    <>
      <Container sx={{ marginTop: "20px" }}>
        <Box>
          <Typography variant="h6">Current Shipping Address</Typography>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Paper
              sx={{
                margin: "5px",
                padding: "10px",
              }}
              elevation={2}
            >
              {currentAddress && (
                <>
                  <Typography variant="subtitle2">
                    Street: {currentAddress.street}
                  </Typography>
                  <Typography variant="subtitle2">
                    State: {currentAddress.state}
                  </Typography>
                  <Typography variant="subtitle2">
                    City: {currentAddress.city}
                  </Typography>
                </>
              )}
            </Paper>
          </Box>
        </Box>
        <Box
          component="form"
          sx={{
            marginLeft: "25%",
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <Typography variant="h6">Add New Address</Typography>
          <div>
            <TextField label="Street Name" id="street-name" />
            <TextField label="City Name" id="city-name" />
          </div>
          <div>
            <TextField label="State" id="state-name" />
            <TextField label="Country" id="country-name" />
          </div>
          <Button variant="contained" onClick={handleButtonClick}>
            Update Address
          </Button>
        </Box>
      </Container>
    </>
  );
}

const MemoziedAddress = React.memo(Address);
export default MemoziedAddress;
