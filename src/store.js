import {configureStore} from '@reduxjs/toolkit'
import productSlice from './features/productSlice'
import userSlice from './features/userSlice'
import appApi from './services/appApi'
import storage from 'redux-persist/lib/storage'
import {combineReducers} from 'redux'
import {persistReducer} from 'redux-persist'
import thunk from 'redux-thunk'

const reducer = combineReducers({
    user: userSlice,
    produk: productSlice,
    [appApi.reducerPath] : appApi.reducer, 
})

const persistConfig ={
    key: 'root',
    storage,
    blackList: [appApi.reducerPath, 'produk']
}

const persistedReducer = persistReducer(persistConfig, reducer)
const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk, appApi.middleware],
})

export default store