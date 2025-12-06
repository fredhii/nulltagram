import React, { useState, useContext } from 'react'
import { API_URL } from '../../config/api'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { UserContext } from '../../App'
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Camera } from 'lucide-react'
import './styles/Auth.css'

const Signup = () => {
    const { dispatch } = useContext(UserContext)
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [profileImage, setProfileImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const googleProvider = new GoogleAuthProvider()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setProfileImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!name.trim()) {
            newErrors.name = 'Name is required'
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters'
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email'
        }

        if (!password) {
            newErrors.password = 'Password is required'
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const uploadProfileImage = async () => {
        if (!profileImage) return null

        const data = new FormData()
        data.append('file', profileImage)
        data.append('upload_preset', 'nulltagram')
        data.append('cloud_name', 'dlvlyhpo7')

        const res = await fetch('https://api.cloudinary.com/v1_1/dlvlyhpo7/image/upload', {
            method: 'post',
            body: data
        })
        const result = await res.json()
        return result.url
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        setErrors({})

        try {
            const imageUrl = await uploadProfileImage()
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const token = await userCredential.user.getIdToken()

            const res = await fetch(`${API_URL}/create-profile`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name.trim(),
                    image: imageUrl
                })
            })

            const data = await res.json()
            if (data.error) {
                setErrors({ general: data.error })
            } else {
                navigate('/signin')
            }
        } catch (err) {
            console.error(err)
            if (err.code === 'auth/email-already-in-use') {
                setErrors({ email: 'This email is already registered' })
            } else if (err.code === 'auth/weak-password') {
                setErrors({ password: 'Password is too weak' })
            } else {
                setErrors({ general: 'Something went wrong. Please try again.' })
            }
        } finally {
            setLoading(false)
        }
    }

    const signUpWithGoogle = async () => {
        setLoading(true)
        setErrors({})

        try {
            const result = await signInWithPopup(auth, googleProvider)
            const token = await result.user.getIdToken()

            // Try to get existing profile
            let res = await fetch(`${API_URL}/get-profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            let data = await res.json()

            // If no profile exists, create one
            if (data.error) {
                res = await fetch(`${API_URL}/create-profile`, {
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
                    setErrors({ general: data.error })
                    return
                }
                data = { user: data.user }
            }

            localStorage.setItem('user', JSON.stringify(data.user))
            dispatch({ type: 'USER', payload: data.user })
            navigate('/')
        } catch (err) {
            console.error(err)
            setErrors({ general: 'Failed to sign up with Google' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='auth-container'>
            <div className='auth-content'>
                <div className='auth-card'>
                    <div className='auth-header'>
                        <h2>Nulltagram</h2>
                        <p>Create your account</p>
                    </div>

                    <p className='signup-subtitle'>
                        Sign up to see photos and videos from your friends
                    </p>

                    {errors.general && (
                        <div className='error-banner'>
                            <AlertCircle size={18} />
                            <span>{errors.general}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='auth-form'>
                        {/* Profile Image Upload */}
                        <div className='profile-upload'>
                            <label className={`profile-preview ${imagePreview ? 'has-image' : ''}`}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt='Profile' />
                                ) : (
                                    <Camera size={28} className='placeholder-icon' />
                                )}
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={handleImageChange}
                                    disabled={loading}
                                />
                            </label>
                            <span className='profile-upload-label'>
                                {imagePreview ? 'Change photo' : 'Add profile photo'}
                            </span>
                        </div>

                        <div className={`form-group ${errors.name ? 'error' : ''}`}>
                            <div className='input-wrapper'>
                                <User size={18} className='input-icon' />
                                <input
                                    type='text'
                                    placeholder='Full name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading}
                                    autoComplete='name'
                                />
                            </div>
                            {errors.name && <span className='error-text'>{errors.name}</span>}
                        </div>

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
                                    autoComplete='new-password'
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

                        <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
                            <div className='input-wrapper'>
                                <Lock size={18} className='input-icon' />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Confirm password'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                    autoComplete='new-password'
                                />
                            </div>
                            {errors.confirmPassword && <span className='error-text'>{errors.confirmPassword}</span>}
                        </div>

                        <button type='submit' className='btn-primary' disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 size={18} className='spinner' />
                                    Creating account...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>

                    <div className='divider'>
                        <span>or</span>
                    </div>

                    <button className='btn-google' onClick={signUpWithGoogle} disabled={loading}>
                        <img src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' alt='Google' />
                        Continue with Google
                    </button>

                    <div className='auth-footer'>
                        <p>Already have an account? <Link to='/signin'>Sign in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
