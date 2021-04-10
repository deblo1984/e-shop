import React, { Fragment, useEffect, useState } from 'react'

import MetaData from '../../layout/MetaData'
import Sidebar from '../../admin/Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getCategoryById, updateCategory } from '../../../actions/categoryAction'
import { GET_CATEGORY_BYID_RESET, UPDATE_CATEGORY_RESET } from '../../../constants/categoryConstant'

const Update = ({ history, match }) => {

    const [name, setName] = useState('')
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error: updateError, isUpdated } = useSelector(state => state.updateCategory);
    const { error, category } = useSelector(state => state.getCategoryById);

    const categoryId = match.params.id

    useEffect(() => {
        if (category && category.id !== categoryId) {
            dispatch(getCategoryById(categoryId))
        } else {
            setName(category.name)
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors());

        }
        if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            history.push('/admin/categories')
            alert.success('category updated successfully')
            dispatch({
                type: UPDATE_CATEGORY_RESET
            })
            dispatch({
                type: GET_CATEGORY_BYID_RESET
            })
        }
    }, [dispatch, alert, categoryId, category, error, history, isUpdated, updateError])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name)

        dispatch(updateCategory(category.id, formData))
    }

    return (
        <Fragment>
            <MetaData title={'Create category'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler}>
                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <button
                                    id="save_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={loading ? true : false}
                                >
                                    Update
                                </button>
                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>
        </Fragment>
    )
}

export default Update
