import './App.css'
import { useEffect, useState } from 'react'
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

//payments import
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'

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
        <Footer />
      </div>
    </Router>
  );
}

export default App;
