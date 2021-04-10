import { CLEAR_ERRORS, CREATE_CATEGORY_FAIL, CREATE_CATEGORY_REQUEST, CREATE_CATEGORY_RESET, CREATE_CATEGORY_SUCCESS, DELETE_CATEGORY_FAIL, DELETE_CATEGORY_REQUEST, DELETE_CATEGORY_RESET, DELETE_CATEGORY_SUCCESS, GET_CATEGORY_BYID_FAIL, GET_CATEGORY_BYID_REQUEST, GET_CATEGORY_BYID_RESET, GET_CATEGORY_BYID_SUCCESS, GET_CATEGORY_FAIL, GET_CATEGORY_REQUEST, GET_CATEGORY_SUCCESS, UPDATE_CATEGORY_FAIL, UPDATE_CATEGORY_REQUEST, UPDATE_CATEGORY_RESET, UPDATE_CATEGORY_SUCCESS } from "../constants/categoryConstant"

export const categoryReducer = (state = { categories: [] }, action) => {
    switch (action.type) {
        case GET_CATEGORY_REQUEST:
            return {
                loading: true,
                categories: []
            }
        case GET_CATEGORY_SUCCESS:
            return {
                loading: false,
                categories: action.payload.categories
            }
        case GET_CATEGORY_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

export const getCategoryByIdReducer = (state = { category: {} }, action) => {
    switch (action.type) {
        case GET_CATEGORY_BYID_REQUEST:
            return {
                ...state,
                loading: true
            }
        case GET_CATEGORY_BYID_SUCCESS:
            return {
                loading: false,
                category: action.payload.category
            }
        case GET_CATEGORY_BYID_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case GET_CATEGORY_BYID_RESET:
            return {
                category: {}
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

export const createCategoryReducer = (state = { category: {} }, action) => {
    switch (action.type) {
        case CREATE_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true
            }
        case CREATE_CATEGORY_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                category: action.payload.category
            }
        case CREATE_CATEGORY_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case CREATE_CATEGORY_RESET:
            return {
                ...state,
                success: false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const updateCategoryReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true
            }
        case UPDATE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }
        case UPDATE_CATEGORY_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case UPDATE_CATEGORY_RESET:
            return {
                ...state,
                isUpdated: false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

export const deleteCategoryReducer = (state = {}, action) => {
    switch (action.type) {
        case DELETE_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case DELETE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }
        case DELETE_CATEGORY_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case DELETE_CATEGORY_RESET:
            return {
                ...state,
                isDeleted: false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}
