import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { UserContext } from '../../App'
import M from 'materialize-css'
import loginHero from '../../assets/login-hero.jpg'
import "./styles/Signin.css"
import "./styles/commons.css"

/**
 * Name: Signin
 * Description: Login view
 */
const Signin = () => {
    const { dispatch } = useContext(UserContext)
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const googleProvider = new GoogleAuthProvider()

    /* =================================================================== */
    /* Try to log in with Firebase Auth */
    /* =================================================================== */
    const PostData = async () => {
        // eslint-disable-next-line
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
            return M.toast({ html: 'invalid email', classes:'#c62828 red darken-3' })

        setLoading(true)
        try {
            // Sign in with Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const token = await userCredential.user.getIdToken()

            // Get user profile from backend
            const res = await fetch('/get-profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await res.json()

            if (data.error) {
                M.toast({ html: data.error, classes:'#c62828 red darken-3' })
            } else {
                localStorage.setItem('user', JSON.stringify(data.user))
                dispatch({ type: 'USER', payload: data.user })
                M.toast({ html: 'Signed in successfully', classes:'#2e7d32 green darken-3' })
                navigate('/')
            }
        } catch (err) {
            console.error(err)
            const errorMessage = err.code === 'auth/invalid-credential'
                ? 'Invalid email or password'
                : err.message
            M.toast({ html: errorMessage, classes:'#c62828 red darken-3' })
        } finally {
            setLoading(false)
        }
    }

    /* =================================================================== */
    /* Google Sign In */
    /* =================================================================== */
    const signInWithGoogle = async () => {
        setLoading(true)
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const token = await result.user.getIdToken()

            // Try to get existing profile
            let res = await fetch('/get-profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            let data = await res.json()

            // If no profile exists, create one
            if (data.error) {
                res = await fetch('/create-profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: result.user.displayName || result.user.email.split('@')[0],
                        image: result.user.photoURL
                    })
                })
                data = await res.json()
                if (data.error) {
                    M.toast({ html: data.error, classes: '#c62828 red darken-3' })
                    return
                }
                data = { user: data.user }
            }

            localStorage.setItem('user', JSON.stringify(data.user))
            dispatch({ type: 'USER', payload: data.user })
            M.toast({ html: 'Signed in with Google', classes: '#2e7d32 green darken-3' })
            navigate('/')
        } catch (err) {
            console.error(err)
            M.toast({ html: err.message, classes: '#c62828 red darken-3' })
        } finally {
            setLoading(false)
        }
    }

    /* =================================================================== */
    /* HTML */
    /* =================================================================== */
    return (
        <div className="container container__signin">
            <div className="container__img">
                <img alt="Creative lightbulb" src={loginHero} />
                <p className="photo-credit">
                    Photo by <a href="https://unsplash.com/@jdiegoph?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Diego PH</a> on <a href="https://unsplash.com/photos/person-holding-light-bulb-fIq0tET6llw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                </p>
            </div>

            <div className='mycard'>
                <div className="card auth-card input-field">
                    <h2>Nulltagram</h2>
                    <input type='text' placeholder='email' value={ email } onChange={ (e) => setEmail(e.target.value) } />
                    <input type='password' placeholder='password' value={ password } onChange={ (e) => setPassword(e.target.value) } />
                    <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={ () => PostData() } disabled={loading}>
                        {loading ? 'Signing in...' : 'Signin'}
                    </button>
                    <div className="divider-text"><span>or</span></div>
                    <button className="btn waves-effect waves-light white black-text google-btn" onClick={signInWithGoogle} disabled={loading}>
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                        Continue with Google
                    </button>
                </div>
                <div className="card auth-card input-field">
                    <p> Don't have an account? <Link to='./signup'> <span>Sign up </span> </Link></p>
                </div>
            </div>
        </div>
    )
}

export default Signin
