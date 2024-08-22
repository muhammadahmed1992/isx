/* eslint-disable prettier/prettier */
import { persistReducer, persistStore } from 'redux-persist';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Auth from '../reducers/authSlice';
import ConnectionString from '../reducers/connectionStringSlice';
import Menu from '../reducers/menuSlice'; // Import the Menu slice

// Define persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// Combine all reducers into one root reducer
const reducerToPersist = combineReducers({
  Auth,
  ConnectionString,
  Menu,
});

// Persist the combined reducer
const persistedReducer = persistReducer(persistConfig, reducerToPersist);

// Configure the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  // No custom middleware needed
});

// Set up the persistor
const persistor = persistStore(store);

export { store, persistor};
