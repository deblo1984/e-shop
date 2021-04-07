import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import { productsReducer, productDetailsReducer } from './reducers/productReducers'
import { userReducer, profileReducer, forgotPasswordReducer } from './reducers/userReducer'
import { cartReducer } from './reducers/cartReducer'
import { newOrderReducer, userOrdersReducer } from './reducers/orderReducer'

const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    auth: userReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    userOrders: userOrdersReducer
})

let initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingInfo: localStorage.getItem('shippingInfo')
            ? JSON.parse(localStorage.getItem('shippingInfo'))
            : {},
    }

}

const middleware = [thunk]
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store;