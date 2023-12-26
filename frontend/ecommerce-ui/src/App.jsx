import "./App.css";
import ResponsiveAppBar from "./components/appBar";
import ProductListing from "./components/Listing";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignUp from "./components/SignUp";
import SignInSide from "./components/SignInSide";
import Cookies from "js-cookie";
import { useCookies } from "react-cookie";

import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import Orders from "./components/Orders";
import Product from "./components/Product";
import Checkout from "./components/Checkout";
import Address from "./components/Address";
import SimpleCounter from "./components/SimpleCounter";
import OrderPlaced from "./components/OrderPlaced";

function App() {
  const token = Cookies.get("token");
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const handleLogout = () => {
    removeCookie("token");
  };

  return (
    <>
      <BrowserRouter>
        {token && <ResponsiveAppBar handleLogout={handleLogout} />}
        <Routes>
          <Route
            path="/"
            element={token ? <ProductListing /> : <SignInSide />}
          ></Route>
          <Route exact path="/signup" element={<SignUp></SignUp>}></Route>
          <Route
            exact
            path="/login"
            element={<SignInSide></SignInSide>}
          ></Route>
          <Route
            exact
            path="/cart"
            element={token ? <Cart /> : <SignInSide />}
          ></Route>
          <Route
            exact
            path="/wishlist"
            element={token ? <Wishlist /> : <SignInSide />}
          ></Route>
          <Route
            exact
            path="/orders"
            element={token ? <Orders /> : <SignInSide />}
          ></Route>
          <Route
            exact
            path="/products/:id"
            element={token ? <Product /> : <SignInSide />}
          ></Route>
          <Route
            exact
            path="/checkout"
            element={token ? <Checkout /> : <SignInSide />}
          ></Route>
          <Route
            exact
            path="/address"
            element={token ? <Address /> : <SignInSide />}
          ></Route>
          <Route exact path="/placed" element={<OrderPlaced />}></Route>
          {/* <Route
            exact
            path="/counter"
            element={<SimpleCounter></SimpleCounter>}
          ></Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
