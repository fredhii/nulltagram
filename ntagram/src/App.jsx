import React, { useContext, useState, useEffect, createContext, useReducer } from 'react'
import NavBar from './components/Navbar'
import './App.css'
import './theme.css'
import { ThemeProvider } from './context/ThemeContext'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import { reducer, initialState } from './reducers/userReducer'
/* Import routes */
import Home from './components/screens/Home'
import Signin from './components/screens/Signin'
import Signup from './components/screens/Signup'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import PostDetail from './components/screens/PostDetail'
import Explore from './components/screens/Explore'

export const UserContext = createContext()

// Helper to get current Firebase token
export const getAuthToken = async () => {
  const user = auth.currentUser
  if (user) {
    return await user.getIdToken()
  }
  return null
}

const Routing = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(UserContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, get profile from backend
        try {
          const token = await firebaseUser.getIdToken()
          const res = await fetch('/get-profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const data = await res.json()

          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user))
            dispatch({ type: 'USER', payload: data.user })
          }
        } catch (err) {
          console.error('Error fetching profile:', err)
        }
      } else {
        // User is signed out
        localStorage.removeItem('user')
        dispatch({ type: 'CLEAR' })
        navigate('/signin')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [dispatch, navigate])

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading...</div>
  }

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/signin' element={<Signin />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/create' element={<CreatePost />} />
      <Route path='/profile/:userid' element={<UserProfile />} />
      <Route path='/post/:postId' element={<PostDetail />} />
      <Route path='/explore' element={<Explore />} />
    </Routes>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <ThemeProvider>
      <UserContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <NavBar />
          <Routing />
        </BrowserRouter>
      </UserContext.Provider>
    </ThemeProvider>
  )
}

export default App
