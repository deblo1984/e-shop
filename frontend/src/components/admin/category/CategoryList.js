import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import MetaData from '../../layout/MetaData'
import Loader from '../../layout/Loader'
import Sidebar from '../Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { getCategories, deleteCategory, clearErrors } from '../../../actions/categoryAction'
import Message from '../../layout/Message'
import { DELETE_CATEGORY_RESET } from '../../../constants/categoryConstant'


const CategoryList = ({ history }) => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, categories } = useSelector(state => state.category);
    const { error: deleteError, isDeleted } = useSelector(state => state.deleteCategory)

    useEffect(() => {
        dispatch(getCategories())
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (deleteError) {
            alert.error(deleteError)
            dispatch(clearErrors())
        }
        if (isDeleted) {
            alert.success('Category deleted')
            history.push('/admin/categories')
            dispatch({ type: DELETE_CATEGORY_RESET })
        }

    }, [dispatch, error, deleteError, isDeleted, history, alert])

    const setCategories = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Category Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions'
                }
            ],
            rows: []
        }
        if (categories.length > 0) {
            categories.forEach(category => {
                data.rows.push({
                    id: category.id,
                    name: category.name,
                    actions: <Fragment>
                        <Link to={`/admin/category/${category.id}/update`} className='btn btn-primary py-1 px-2'>
                            <i className='fa fa-pencil'></i>
                        </Link>
                        <button className='btn btn-danger py-1 px-2 ml-2' onClick={() => { deleteHandler(category.id) }}>
                            <i className='fa fa-trash'></i>
                        </button>
                    </Fragment>
                })
            })
        }
        return data

    }

    //delete category handler
    const deleteHandler = (id) => {
        if (window.confirm('are you sure')) {
            dispatch(deleteCategory(id));
        }
    }

    return (
        <Fragment>
            <MetaData title={'Categories'} />
            <div className='row'>
                <div className='col-12 col-md-2'>
                    <Sidebar />
                </div>
                <div className='col-12 col-md-10'>
                    <Fragment>
                        <h1 className='my-5'>Categories</h1>
                        {loading ? (<Loader />) : error ? (<Message variant='danger'></Message>) : (
                            <MDBDataTable
                                data={setCategories()}
                                className='px-3'
                                bordered
                                striped
                                hover
                            />
                        )}
                    </Fragment>
                </div>
            </div>
        </Fragment>
    )
}

export default CategoryList
