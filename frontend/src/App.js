import './App.css'
import { useEffect } from 'react'
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

function App() {

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Router>
      <div className="App">
        <Header />
        <div className='container container-fluid'>
          <Route path='/' component={Home} exact />
          <Route path='/search/:keyword' component={Home} />
          <Route path='/product/:id' component={ProductDetails} exact />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/password/forgot' component={ForgotPassword} exact />
          <Route path='/password/reset/:token' component={ResetPassword} exact />
          <ProtectedRoute path='/profile' component={Profile} exact />
          <ProtectedRoute path='/profile/update' component={UpdateProfile} exact />
          <ProtectedRoute path='/password/update' component={UpdatePassword} exact />
          <ProtectedRoute path='/cart' component={Cart} exact />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
