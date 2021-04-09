import axios from 'axios'
import {
    CLEAR_ERRORS,
    CREATE_CATEGORY_FAIL,
    CREATE_CATEGORY_REQUEST,
    CREATE_CATEGORY_SUCCESS,
    DELETE_CATEGORY_FAIL,
    DELETE_CATEGORY_REQUEST,
    DELETE_CATEGORY_SUCCESS,
    GET_CATEGORY_BYID_FAIL,
    GET_CATEGORY_BYID_REQUEST,
    GET_CATEGORY_BYID_SUCCESS,
    GET_CATEGORY_FAIL,
    GET_CATEGORY_REQUEST,
    GET_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_FAIL,
    UPDATE_CATEGORY_REQUEST,
    UPDATE_CATEGORY_SUCCESS
} from '../constants/categoryConstant'

export const getCategories = () => async (dispatch) => {
    try {
        dispatch({ type: GET_CATEGORY_REQUEST })

        const { data } = await axios.get('/api/admin/categories')
        //console.log(data)

        dispatch({
            type: GET_CATEGORY_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: GET_CATEGORY_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        })
    }
}

export const getCategoryById = (id) => async (dispatch) => {
    try {

        dispatch({ type: GET_CATEGORY_BYID_REQUEST })

        const { data } = await axios.get(`/api/admin/category/${id}`)

        dispatch({
            type: GET_CATEGORY_BYID_SUCCESS,
            payload: data.category
        })

    } catch (error) {
        dispatch({
            type: GET_CATEGORY_BYID_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

export const createCategory = (categoryData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_CATEGORY_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/admin/category/create', categoryData, config)

        dispatch({
            type: CREATE_CATEGORY_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: CREATE_CATEGORY_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.messsage
                : error.message
        })
    }
}

export const updateCategory = (id, categoryData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_CATEGORY_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/admin/category/${id}`, categoryData, config)

        dispatch({
            type: UPDATE_CATEGORY_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_CATEGORY_FAIL,
            payload: error.respone && error.respone.data.message
                ? error.respone.data.message
                : error.message
        })
    }
}

export const deleteCategory = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_CATEGORY_REQUEST })

        const { data } = await axios.delete(`/api/admin/category/${id}`)

        dispatch({
            type: DELETE_CATEGORY_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_CATEGORY_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}