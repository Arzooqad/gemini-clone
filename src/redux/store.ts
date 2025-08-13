import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import { loadFromStorage, saveToStorage } from "../utils/storage";

const PERSIST_KEY = "redux_state";

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
});

// Avoid circular typing by using any here; state is validated by reducers
const preloadedState = loadFromStorage<any>(PERSIST_KEY, undefined);

export const store = configureStore({
  reducer: rootReducer,
  preloadedState,
});

store.subscribe(() => {
  saveToStorage(PERSIST_KEY, store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
