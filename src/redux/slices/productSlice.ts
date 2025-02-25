import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import client from "../../apollo/client";
import { GET_CATEGORIES, GET_PRODUCTS_BY_CATEGORY, GET_PRODUCT_DETAILS } from '../../graphql/queries';
import { CREATE_ORDER } from "../../graphql/mutations";
import { ProductType } from "../../types/productType";



interface ProductState {
  categories: { id: string; name: string }[];
  products: any[];
  selectedCategory: string;
  selectedCategoryName: string;
  selectedProduct: any | null;
  loading: boolean;
  error: string | null;
  orderStatus: string | null;
  orderPlaced: boolean;
}

const initialState: ProductState = {
  categories: [],
  products: [],
  selectedCategory: "all",
  selectedCategoryName: 'All',
  selectedProduct: null,
  loading: false,
  error: null,
  orderStatus: null,
  orderPlaced: false
};


export const fetchCategories = createAsyncThunk("products/fetchCategories", async () => {
  const { data } = await client.query({ query: GET_CATEGORIES });
  return data.categories;
});


export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (categoryId: string | number) => {
    const categoryString = String(categoryId);
    const { data } = await client.query({
      query: GET_PRODUCTS_BY_CATEGORY,
      variables: { categoryId: categoryString },
    });
    return data.products;
  }
);


export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (productId: string) => {
    const { data } = await client.query({
      query: GET_PRODUCT_DETAILS,
      variables: { productId },
    });
    return data.product;
  }
);


export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (cartItems: any[], { rejectWithValue }) => {
    try {
      const formattedItems = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.qty,
        attributes: item.attributes?.map((attr: { name: string; values?: { value: string; selected?: boolean }[] }) => ({
          name: attr.name,
          value: attr.values?.find((val: { value: string; selected?: boolean }) => val.selected)?.value || attr.values?.[0]?.value,
        })) || [],
      }));


      const { data } = await client.mutate({
        mutation: CREATE_ORDER,
        variables: { items: formattedItems },
      });

      return data.createOrder; 
    } catch (error: any) { 
      return rejectWithValue(error.message || "Unknown error occurred");
    }

  }
);


const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedCategoryName: (state, action: PayloadAction<string>) => {
      state.selectedCategoryName = action.payload;
    },
    setSelectedProduct: (state, action: PayloadAction<ProductType>) => {
      state.selectedProduct = action.payload;
    },
    setPlaceOrder: (state, action: PayloadAction<boolean>) => {
      state.orderPlaced = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductsByCategory.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch products";
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch product details";
      })
      .addCase(placeOrder.pending, (state) => {
        state.orderStatus = "Processing Order...";
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        console.log(`Order Successful! Order ID: ${action.payload.order_id}`);
        state.orderStatus = `Order Successful! Order ID: ${action.payload.order_id}`;
        state.orderPlaced = true;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        console.error("Order Failed:", action.payload);
        alert("Failed to place order. Please try again.");
        state.orderStatus = "Order Failed. Please try again.";
      });
  },
});


export const { setSelectedCategory, setSelectedProduct, setSelectedCategoryName, setPlaceOrder } = productSlice.actions;
export default productSlice.reducer;
