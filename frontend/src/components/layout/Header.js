import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'

import { logout } from '../../actions/userAction'

import Search from './Search'
import { Route } from 'react-router-dom'
import { hasRole } from '../route/Auth'

import '../../App.css'

const Header = () => {
    const { loading, user } = useSelector(state => state.auth)
    const alert = useAlert();
    const dispatch = useDispatch();

    //console.log(user);
    //const allow = hasRole(user, ['admin'])
    ///console.log(hasRole(user, ['admin']));
    const { cartItems } = useSelector(state => state.cart)

    const logoutHandler = () => {
        dispatch(logout());
        alert.success('Logout success')
    }

    return (
        <Fragment>
            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <Link to='/'>
                        <div className="navbar-brand">
                            <img src="/images/logo.png" alt="Logo" />
                        </div>
                    </Link>
                </div>

                <div className="col-12 col-md-6 mt-2 mt-md-0">
                    <Route render={({ history }) => <Search history={history} />} />
                </div>

                <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                    <Link to='/cart' style={{ textDecoration: 'none' }}>
                        <span id="cart" className="ml-3">Cart</span>
                        <span className="ml-1" id="cart_count">
                            {cartItems.reduce((acc, item) => (acc + Number(item.quantity)), 0)}
                        </span>
                    </Link>
                    {user ? (
                        <div className="ml-4 dropdown d-inline">
                            <Link to="#!"
                                className="btn dropdown-toggle text-white mr-4"
                                type="button" id="dropDownMenuButton"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false">

                                <figure className="avatar avatar-nav">
                                    {user.avatar && user.avatar.url !== '' ? (
                                        <img
                                            src={user.avatar.url}
                                            alt={user && user.name}
                                            className="rounded-circle"
                                        />
                                    ) : (
                                        <img
                                            src='/images/default_avatar.jpg'
                                            alt='profile images'
                                            className="rounded-circle"
                                        />
                                    )}

                                </figure>
                                <span>{user && user.name}</span>
                            </Link>
                            <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                                {hasRole(user, ['admin']) && (
                                    <Link className="dropdown-item" to="/admin/dashboard">Dashboard</Link>
                                )}
                                <Link className="dropdown-item" to="/orders">Orders</Link>
                                <Link className="dropdown-item" to="/profile">Profile</Link>
                                <Link className="dropdown-item text-danger" to="/" onClick={logoutHandler}>
                                    Logout
                                </Link>
                            </div>


                        </div>

                    ) : !loading &&
                    <Link to="/login" className="btn ml-4" id="login_btn">Login</Link>
                    }
                </div>
            </nav>
        </Fragment>
    )
}

export default Header
