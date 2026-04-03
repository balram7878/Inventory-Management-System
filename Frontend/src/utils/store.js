import { configureStore } from "@reduxjs/toolkit";
import authSliceReducers from "./Slices/authSlice";

const store = configureStore({
  reducer: {
    authSlice: authSliceReducers,
  },
});

export default store;
