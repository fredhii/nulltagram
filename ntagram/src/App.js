import React, { useContext } from 'react'
import NavBar from './components/Navbar'
import './App.css'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import { useEffect, createContext, useReducer } from 'react'
import { reducer, initialState } from './reducers/userReducer'
/* Import routes */
import Home from './components/screens/Home'
import Signin from './components/screens/Signin'
import Signup from './components/screens/Signup'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
export const UserContext = createContext()


const Routing = () => {
  const history = useHistory()
  const { dispatch } = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      dispatch({ type: 'USER', payload: user })
    } else {
      history.push('/signin')
    }
  }, [ history, dispatch ])
  return (
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route path='/signin'>
        <Signin />
      </Route>
      <Route path='/signup'>
        <Signup />
      </Route>
      <Route exact path='/profile'>
        <Profile />
      </Route>
      <Route path='/create'>
        <CreatePost />
      </Route>
      <Route path='/profile/:userid'>
        <UserProfile />
      </Route>
    </Switch>
  )
}

function App() {
  const [ state, dispatch ] = useReducer( reducer, initialState )
  return (
    <UserContext.Provider value={{ state, dispatch }}>
    <BrowserRouter>
      <NavBar />
      <Routing />
    </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
