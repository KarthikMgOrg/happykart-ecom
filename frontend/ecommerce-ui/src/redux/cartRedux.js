import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  total: 0,
  totalQuantity: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCartReducer: (state, action) => {
      const product = action.payload;
      const quantity = 1;
      const existingItem = state.cartItems.find(
        (item) => item._id === product._id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        state.totalQuantity += 1;
      } else {
        product.quantity = 1;
        state.cartItems.push(product);
        state.totalQuantity += 1;
      }
      state.total += product.availablePrice * quantity;
    },
    removeFromCartReducer: (state, action) => {
      const product = action.payload;
      const id = product._id;
      const itemIndex = state.cartItems.findIndex((item) => item._id === id);

      console.log(state.cartItems, " is the current cart");
      console.log(itemIndex, " is the item you wish to remove");

      if (itemIndex !== -1) {
        const removedItem = state.cartItems[itemIndex];
        if (removedItem.quantity > 1) {
          removedItem.quantity -= 1;
          state.totalQuantity -= 1;
          state.total -= removedItem.availablePrice;
        } else {
          state.cartItems.splice(itemIndex, 1);
          state.total -= removedItem.availablePrice * removedItem.quantity;
          state.totalQuantity -= 1;
        }
      }
    },
    clearCartReducer: (state) => {
      state.cartItems = [];
      state.total = 0;
      state.totalQuantity = 0;
    },
    updateCartReducer: (state, action) => {
      console.log("updating cart items");
      state.cartItems = action.payload;
      state.totalQuantity = action.payload.length;
      let curTotal = 0;
      state.cartItems.forEach((item) => {
        curTotal += item.qty * item.availablePrice;
        // state.total += item.qty * item.availablePrice;
      });
      state.total = curTotal;
    },
  },
});

export const {
  addToCartReducer,
  removeFromCartReducer,
  clearCartReducer,
  updateCartReducer,
} = cartSlice.actions;

export default cartSlice.reducer;
