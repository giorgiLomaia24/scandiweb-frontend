import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItemType, CartType } from "../../types/cartType";





const loadCartFromStorage = (): CartType => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : { totalItemCount: 0, items: [], totalPrice: 0 };
};



const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action: PayloadAction<CartItemType>) => {


      const uniqueKey = action.payload.uniqueKey;

      const existingItem = state.items.find((item) => item.uniqueKey === uniqueKey);

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        state.items.unshift(action.payload);
      }
      state.totalItemCount = state.items.length;

      state.totalPrice = state.items.reduce((sum, item) => sum + item.price.amount * item.qty, 0);
      localStorage.setItem("cart", JSON.stringify(state));
      console.log("Updated Cart:", state.items);
    },



    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemIndex = state.items.findIndex(
        (item) => item.uniqueKey === action.payload
      );

      if (itemIndex !== -1) {
        state.totalItemCount -= state.items[itemIndex].qty;
        state.totalPrice -=
          state.items[itemIndex].price.amount * state.items[itemIndex].qty;
        state.items.splice(itemIndex, 1);
      }

      localStorage.setItem("cart", JSON.stringify(state));
    },

    increaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.uniqueKey === action.payload);
      if (item) {
        item.qty += 1;
        state.totalPrice += item.price.amount;
      }

      localStorage.setItem("cart", JSON.stringify(state));
    },


    decreaseQty: (state, action: PayloadAction<string>) => {
      const itemIndex = state.items.findIndex((item) => item.uniqueKey === action.payload);

      if (itemIndex !== -1) {
        const item = state.items[itemIndex];

        if (item.qty === 1) {
          state.items.splice(itemIndex, 1);
        } else {
          item.qty -= 1;
        }
      }
      state.totalItemCount = state.items.length;

      state.totalPrice = state.items.reduce((sum, item) => sum + item.price.amount * item.qty, 0);

      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItemCount = 0;
      state.totalPrice = 0;
    },

  },
});


export const { addToCart, removeFromCart, increaseQty, decreaseQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
