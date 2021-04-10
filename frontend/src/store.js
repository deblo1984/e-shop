import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import {
    productsReducer,
    productDetailsReducer,
    adminProductsReducer,
    createProductReducer,
    deleteProductReducer,
    updateProductReducer
} from './reducers/productReducers'
import {
    userReducer,
    profileReducer,
    forgotPasswordReducer
} from './reducers/userReducer'
import { cartReducer } from './reducers/cartReducer'
import {
    newOrderReducer,
    userOrdersReducer,
    userOrderDetailsReducer
} from './reducers/orderReducer'
import {
    categoryReducer,
    createCategoryReducer,
    deleteCategoryReducer,
    getCategoryByIdReducer,
    updateCategoryReducer
} from './reducers/categoryReducers'

const reducer = combineReducers({
    //products store
    products: productsReducer,
    createProducts: createProductReducer,
    deleteProduct: deleteProductReducer,
    updateProduct: updateProductReducer,
    productDetails: productDetailsReducer,
    adminProducts: adminProductsReducer,
    //authetication store
    auth: userReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,
    //cart and order store
    cart: cartReducer,
    newOrder: newOrderReducer,
    userOrders: userOrdersReducer,
    userOrderDetails: userOrderDetailsReducer,
    //category store
    category: categoryReducer,
    createCategory: createCategoryReducer,
    deleteCategory: deleteCategoryReducer,
    updateCategory: updateCategoryReducer,
    getCategoryById: getCategoryByIdReducer,
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