import { configureStore } from "@reduxjs/toolkit";

// Reducers Importing
import workerReducer from "./reducers/workerReducer";
import popupReducer from "./reducers/popupReducer";

const reducer = {
  worker: workerReducer,
  popup: popupReducer
};

const workerDetailsFromStorage = localStorage.getItem("workerInfo")
  ? JSON.parse(localStorage.getItem("workerInfo"))
  : null;

let initialState;
if (workerDetailsFromStorage) {
  initialState = {
    worker: workerDetailsFromStorage,
  };
}

const store = configureStore({
  reducer: reducer,
  preloadedState: initialState,
  devTools: true,
});

export default store;