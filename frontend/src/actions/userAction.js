import axios from 'axios'
import {
    CLEAR_ERRORS,
    LOAD_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOGIN_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT_FAIL,
    LOGOUT_SUCCESS,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS
} from "../constants/userConstant"


export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/login', { email, password }, config)
        dispatch({
            type: LOGIN_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.messsage
        })
    }
}

export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST })
        const config = {
            'Contonet-Type': 'application/json'
        }
        const { data } = await axios.post('/api/register', { name, email, password }, config)
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response.messsage.data
        })

    }
}


export const loadUser = () => async (dispatch) => {
    try {

        dispatch({ type: LOAD_USER_REQUEST });
        const { data } = await axios.get('/api/profile');
        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.messsage
        })
    }
}

export const logout = () => async (dispatch) => {
    try {
        await axios.get('/api/logout');
        dispatch({
            type: LOGOUT_SUCCESS
        })


    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: error.response.data.messsage
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: LOAD_USER_FAIL,
    })
}