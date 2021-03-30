import axios from 'axios'
import {
    CLEAR_ERRORS,
    FORGOT_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    LOAD_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOGIN_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT_FAIL,
    LOGOUT_SUCCESS,
    NEW_PASSWORD_FAIL,
    NEW_PASSWORD_REQUEST,
    NEW_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS
} from "../constants/userConstant"


//user login
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
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,

        })
    }
}

//user registration action

export const register = (userData) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.post('/api/register', userData, config)
        console.log(data);
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,

        })

    }
}

//update profile

export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PROFILE_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.post('/api/profile/update', userData, config)
        console.log(data);
        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,

        })

    }
}

///update password
export const updatePassword = (passwords) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PASSWORD_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.put('/api/password/update', passwords, config)
        console.log(data);
        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,

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

export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/password/forgot', email, config)
        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        })
    }
}

export const resetPassword = (token, password) => async (dispatch) => {
    try {
        dispatch({ type: NEW_PASSWORD_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.put(`/api/password/reset/${token}`, password, config)
        dispatch({
            type: NEW_PASSWORD_SUCCESS,
            payload: data.message
        })
    } catch (error) {
        dispatch({
            type: NEW_PASSWORD_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS,
    })
}