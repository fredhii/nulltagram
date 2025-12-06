import React, { useContext, useState } from 'react'
import { API_URL } from '../../config/api'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { UserContext } from '../../App'
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import loginHero from '../../assets/login-hero.jpg'
import './styles/Auth.css'

const Signin = () => {
    const { dispatch } = useContext(UserContext)
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const googleProvider = new GoogleAuthProvider()

    const validateForm = () => {
        const newErrors = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email'
        }

        if (!password) {
            newErrors.password = 'Password is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        setErrors({})

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const token = await userCredential.user.getIdToken()

            const res = await fetch(`${API_URL}/get-profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()

            if (data.error) {
                setErrors({ general: data.error })
            } else {
                localStorage.setItem('user', JSON.stringify(data.user))
                dispatch({ type: 'USER', payload: data.user })
                navigate('/')
            }
        } catch (err) {
            console.error(err)
            if (err.code === 'auth/invalid-credential') {
                setErrors({ general: 'Invalid email or password' })
            } else if (err.code === 'auth/too-many-requests') {
                setErrors({ general: 'Too many attempts. Please try again later.' })
            } else {
                setErrors({ general: 'Something went wrong. Please try again.' })
            }
        } finally {
            setLoading(false)
        }
    }

    const signInWithGoogle = async () => {
        setLoading(true)
        setErrors({})

        try {
            const result = await signInWithPopup(auth, googleProvider)
            const token = await result.user.getIdToken()

            let res = await fetch(`${API_URL}/get-profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            let data = await res.json()

            if (data.error) {
                // Profile doesn't exist, create one
                const profileData = {
                    name: result.user.displayName || result.user.email.split('@')[0],
                    image: result.user.photoURL || undefined
                }

                res = await fetch(`${API_URL}/create-profile`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(profileData)
                })

                if (!res.ok) {
                    const errorData = await res.json()
                    setErrors({ general: errorData.error || `Failed to create profile (${res.status})` })
                    return
                }

                data = await res.json()
                if (data.error) {
                    setErrors({ general: data.error })
                    return
                }
                data = { user: data.user }
            }

            localStorage.setItem('user', JSON.stringify(data.user))
            dispatch({ type: 'USER', payload: data.user })
            navigate('/')
        } catch (err) {
            console.error('Google sign-in error:', err)
            if (err.code === 'auth/popup-closed-by-user') {
                setErrors({ general: 'Sign-in cancelled' })
            } else if (err.code === 'auth/popup-blocked') {
                setErrors({ general: 'Popup blocked. Please allow popups for this site.' })
            } else if (err.code === 'auth/unauthorized-domain') {
                setErrors({ general: 'This domain is not authorized. Add it in Firebase Console.' })
            } else {
                setErrors({ general: err.message || 'Failed to sign in with Google' })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='auth-container'>
            <div className='auth-hero'>
                <img src={loginHero} alt='Welcome' />
                <div className='hero-overlay'>
                    <h1>Welcome Back</h1>
                    <p>Share your moments with the world</p>
                </div>
            </div>

            <div className='auth-content'>
                <div className='auth-card'>
                    <div className='auth-header'>
                        <h2>Nulltagram</h2>
                        <p>Sign in to continue</p>
                    </div>

                    {errors.general && (
                        <div className='error-banner'>
                            <AlertCircle size={18} />
                            <span>{errors.general}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='auth-form'>
                        <div className={`form-group ${errors.email ? 'error' : ''}`}>
                            <div className='input-wrapper'>
                                <Mail size={18} className='input-icon' />
                                <input
                                    type='email'
                                    placeholder='Email address'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    autoComplete='email'
                                />
                            </div>
                            {errors.email && <span className='error-text'>{errors.email}</span>}
                        </div>

                        <div className={`form-group ${errors.password ? 'error' : ''}`}>
                            <div className='input-wrapper'>
                                <Lock size={18} className='input-icon' />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    autoComplete='current-password'
                                />
                                <button
                                    type='button'
                                    className='password-toggle'
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <span className='error-text'>{errors.password}</span>}
                        </div>

                        <button type='submit' className='btn-primary' disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 size={18} className='spinner' />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className='divider'>
                        <span>or</span>
                    </div>

                    <button className='btn-google' onClick={signInWithGoogle} disabled={loading}>
                        <img src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' alt='Google' />
                        Continue with Google
                    </button>

                    <div className='auth-footer'>
                        <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signin
