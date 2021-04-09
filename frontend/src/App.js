import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import Home from './components/layout/Home'
import Login from './components/users/Login'
import Register from './components/users/Register'
import ProductDetails from './components/product/ProductDetails'
import Profile from './components/users/Profile'
import UpdateProfile from './components/users/UpdateProfile'
import ForgotPassword from './components/users/ForgotPassword'

import ProtectedRoute from './components/route/ProtectedRoute'

import { loadUser } from './actions/userAction'
import store from './store'
import UpdatePassword from './components/users/UpdatePassword'
import ResetPassword from './components/users/ResetPassword'

import Cart from './components/cart/Cart'
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import StripePayment from './components/cart/StripePayment'
import OrderSuccess from './components/cart/OrderSuccess'

import OrderList from './components/order/OrderList'
import OrderDetails from './components/order/OrderDetails'

//admin imports
import Dashboard from './components/admin/Dashboard'
import ProductsList from './components/admin/ProductsList'
import CreateProduct from './components/admin/CreateProduct'
import UpdateProduct from './components/admin/UpdateProduct'

//payments import
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
//import { hasRole } from './components/route/Auth'

function App() {

  const [stripeApiKey, setStripeApiKey] = useState('');

  useEffect(() => {

    store.dispatch(loadUser())


    async function getStripeApiKey() {
      const { data } = await axios.get('/api/stripeapi');
      setStripeApiKey(data.stripeApiKey)
    }

    getStripeApiKey();

  }, [])

  const { user, isAuthenticated, loading } = useSelector(state => state.auth)

  return (
    <Router>
      <div className="App">
        <Header />
        <div className='container container-fluid'>
          <Route path='/' component={Home} exact />

          <ProtectedRoute path='/cart' component={Cart} exact />
          <ProtectedRoute path='/shipping' component={Shipping} exact />
          <ProtectedRoute path='/order/confirm' component={ConfirmOrder} exact />
          <ProtectedRoute path='/order/success' component={OrderSuccess} exact />
          {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/order/payment" component={StripePayment} />
            </Elements>
          }

          <ProtectedRoute path='/orders' component={OrderList} exact />
          <ProtectedRoute path='/orders/:id' component={OrderDetails} exact />

          <Route path='/search/:keyword' component={Home} />
          <Route path='/product/:id' component={ProductDetails} exact />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/password/forgot' component={ForgotPassword} exact />
          <Route path='/password/reset/:token' component={ResetPassword} exact />
          <ProtectedRoute path='/profile' component={Profile} exact />
          <ProtectedRoute path='/profile/update' component={UpdateProfile} exact />
          <ProtectedRoute path='/password/update' component={UpdatePassword} exact />
        </div>

        <ProtectedRoute path='/admin/dashboard' isAdmin={true} component={Dashboard} exact />
        <ProtectedRoute path='/admin/products' isAdmin={true} component={ProductsList} exact />
        <ProtectedRoute path='/admin/products/create' isAdmin={true} component={CreateProduct} exact />
        <ProtectedRoute path='/admin/products/:id/update' isAdmin={true} component={UpdateProduct} exact />
        {/* 
          protected routes using role privalage
          <ProtectedRoute path='/profile' isAdmin={true} component={Profile} exact />
          */}

        <Footer />

      </div>
    </Router>
  );
}

export default App;
