import axios from 'axios'

import {
    CLEAR_ERRORS,
    CREATE_ORDER_FAIL,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    USER_ORDER_DETAIL_FAIL,
    USER_ORDER_DETAIL_REQUEST,
    USER_ORDER_DETAIL_SUCCESS,
    USER_ORDER_FAIL,
    USER_ORDER_REQUEST,
    USER_ORDER_SUCCESS
} from "../constants/orderConstant"

export const createOrder = (order) => async (dispatch, getState) => {
    try {

        dispatch({ type: CREATE_ORDER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/order/create', order, config)

        dispatch({
            type: CREATE_ORDER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: CREATE_ORDER_FAIL,
            payload: error.response.data.message
        })
    }
}

export const userOrders = () => async (dispatch) => {
    try {
        dispatch({
            type: USER_ORDER_REQUEST
        })
        const { data } = await axios.get('/api/orders')
        dispatch({
            type: USER_ORDER_SUCCESS,
            payload: data.orders
        })

    } catch (error) {
        dispatch({
            type: USER_ORDER_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getUserOrderDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: USER_ORDER_DETAIL_REQUEST })
        const { data } = await axios.get(`/api/orders/${id}`);
        console.log(data);
        dispatch({
            type: USER_ORDER_DETAIL_SUCCESS,
            payload: data.order
        })
    } catch (error) {
        dispatch({
            type: USER_ORDER_DETAIL_FAIL,
            payload: error.response.data.message
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}