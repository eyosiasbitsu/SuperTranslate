"use strict";
import { configureStore } from "@reduxjs/toolkit";
import { translateAPI } from "./translateAPI";


export const store = configureStore({
  reducer: {
       
        [translateAPI.reducerPath]: translateAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
              getDefaultMiddleware()
              .concat(translateAPI.middleware)
              
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
