import React, { useState } from 'react'
import { API_URL } from '../../config/api'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config/firebase'
import M from 'materialize-css'
import "./styles/Signup.css"
import "./styles/commons.css"

/**
 * Name: Signup
 * Description: Creates an account with Firebase Auth
 */
const Signup = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [profileImage, setProfileImage] = useState('')
    const [loading, setLoading] = useState(false)

    /* =================================================================== */
    /* Uploads profile image to Cloudinary */
    /* =================================================================== */
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

    /* =================================================================== */
    /* Creates an account with Firebase Auth */
    /* =================================================================== */
    const PostData = async () => {
        if (!name || !email || !password) {
            return M.toast({ html: 'Please fill all fields', classes: '#c62828 red darken-3' })
        }

        // eslint-disable-next-line
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return M.toast({ html: 'Invalid email', classes: '#c62828 red darken-3' })
        }

        if (password.length < 6) {
            return M.toast({ html: 'Password must be at least 6 characters', classes: '#c62828 red darken-3' })
        }

        setLoading(true)
        try {
            // Upload profile image if provided
            const imageUrl = await uploadProfileImage()

            // Create Firebase Auth account
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const token = await userCredential.user.getIdToken()

            // Create user profile in Firestore via backend
            const res = await fetch(`${API_URL}/create-profile`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    image: imageUrl
                })
            })

            const data = await res.json()
            if (data.error) {
                M.toast({ html: data.error, classes: '#c62828 red darken-3' })
            } else {
                M.toast({ html: 'Account created successfully', classes: '#2e7d32 green darken-3' })
                navigate('/signin')
            }
        } catch (err) {
            console.error(err)
            let errorMessage = err.message
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'Email already in use'
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak'
            }
            M.toast({ html: errorMessage, classes: '#c62828 red darken-3' })
        } finally {
            setLoading(false)
        }
    }

    /* =================================================================== */
    /* HTML */
    /* =================================================================== */
    return (
        <div className="container">
            <div className='mycard'>
                <div className="card auth-card input-field">
                    <h2>Nulltagram</h2>
                    <p>Signup to see photos and videos from your friends!</p>
                    <input type='text' placeholder='name' value={name} onChange={(e) => setName(e.target.value)} />
                    <input type='text' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <div className='file-field input-field'>
                        <div className='btn #64b5f6 blue darken-1'>
                            <span>Upload profile image</span>
                            <input type='file' onChange={(e) => setProfileImage(e.target.files[0])} />
                        </div>
                        <div className='file-path-wrapper'>
                            <input className='file-path validate' type='text' />
                        </div>
                    </div>
                    <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => PostData()} disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign up'}
                    </button>
                    <br />
                </div>
                <div className="card auth-card input-field">
                    <p> Already have an account? <Link to='./signin'> <span> Login </span></Link></p>
                </div>
                <div className="container__appfield">
                    <p> Get the app</p>
                    <div>
                        <img width="150" alt="" src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/180ae7a0bcf7.png" />
                        <img width="150" alt="" src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/e9cd846dc748.png" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
