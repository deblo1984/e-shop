import React, { Fragment, useState, useEffect } from 'react'

import Metadata from '../layout/MetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { register, clearErrors } from '../../actions/userAction'

const Register = ({ history }) => {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    })

    const { name, email, password } = user;

    const alert = useAlert();
    const dispatch = useDispatch();

    const { isAuthenticated, error, loading } = useSelector(state => state.user)

    useEffect(() => {
        if (isAuthenticated) {
            history.push('/');
        }
    }, [])

    return (
        <div>

        </div>
    )
}

export default Register
