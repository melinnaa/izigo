import { configureStore, combineReducers, getDefaultMiddleware } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

const reducers = combineReducers({
    //Insert reducers just as below
    //keyName: nameSliceReducer
})

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    //blacklist (not persist these reducers): ['keyToIgnore']
};

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
    reducer: persistedReducer
});

export const persistor = persistStore(store);