import './App.css';
import { useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Footer from './components/layout/Footer';
import Header from './components/layout/Header'
import Home from './components/layout/Home';
import Login from './components/users/Login';
import Register from './components/users/Register';
import ProductDetails from './components/product/ProductDetails';

import { loadUser } from './actions/userAction'
import store from './store'

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
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
