import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
import Sidebar from './Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { adminGetProducts, clearErrors, deleteProduct } from '../../actions/productAction'
import { DELETE_PRODUCTS_RESET } from '../../constants/productConstant'

const ProductsList = ({ history }) => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, products } = useSelector(state => state.adminProducts);
    const { error: errorDeleted, isDeleted } = useSelector(state => state.deleteProduct);

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id))
    }

    useEffect(() => {
        dispatch(adminGetProducts());
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        if (errorDeleted) {
            alert.error(error);
            dispatch(clearErrors())
        }
        if (isDeleted) {
            alert.success('Product deleted successfully')
            history.push('/admin/products')
            dispatch({ type: DELETE_PRODUCTS_RESET })
        }

    }, [dispatch, alert, error, errorDeleted, history, isDeleted])

    const setProducts = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort: 'asc'
                },
                {
                    label: 'Stock',
                    field: 'stock',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }

        products.forEach(product => {
            data.rows.push({
                id: product.id,
                name: product.name,
                price: `$${product.price}`,
                stock: product.stock,
                actions: <Fragment>
                    <Link to={`/admin/products/${product.id}/update`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteProductHandler(product.id)} >
                        <i className="fa fa-trash"></i>
                    </button>
                </Fragment>
            })
        })
        console.log(data)
        return data;
    }


    return (
        <Fragment>
            <MetaData title={'all products'} />
            <div className='row'>
                <div className='col-12 col-md-2'>
                    <Sidebar />
                </div>


                <div className='col-12 col-md-10'>
                    <Fragment>
                        <h1 className='my-5'>All Products</h1>
                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setProducts()}
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

export default ProductsList