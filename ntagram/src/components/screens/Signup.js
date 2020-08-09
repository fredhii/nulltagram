import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import "./styles/Signup.css"
import "./styles/commons.css"
/**
 * Name: Signup
 * Description: Creates an account
 */
const Signup = () => {
    const history = useHistory()
    const [ name, setName ] = React.useState('')
    const [ email, setEmail ] = React.useState('')
    const [ password, setPassword ] = React.useState('')
    const [ profileImage, setProfileImage ] = React.useState('')
    const [ url, setUrl ] = React.useState(undefined)

    useEffect(() => {
        if (url) {
            // eslint-disable-next-line
            if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
                return M.toast({ html: 'invalid email', classes:'#c62828 red darken-3' })
            fetch('/signup', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    image: url
                })
            })
            .then( res => res.json() )
            .then( data => {
                if (data.error)
                    M.toast({ html: data.error, classes:'#c62828 red darken-3' })
                else {
                    M.toast({ html: data.message, classes:'#2e7d32 green darken-3' })
                    history.push('/signin')
                }
            })
            .catch( err => {
                console.log(err)
            })
         }
    }, [ url, email, history, name, password ])

    /* =================================================================== */
    /* Uploads new account data */
    /* =================================================================== */
    const UploadNewUserData = () => {
        // eslint-disable-next-line
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
            return M.toast({ html: 'invalid email', classes:'#c62828 red darken-3' })
        fetch('/signup', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                image: url
            })
        })
        .then( res => res.json() )
        .then( data => {
            if (data.error)
                M.toast({ html: data.error, classes:'#c62828 red darken-3' })
            else {
                M.toast({ html: data.message, classes:'#2e7d32 green darken-3' })
                history.push('/signin')
            }
        })
        .catch( err => {
            console.log(err)
        })
    }

    /* =================================================================== */
    /* Uploads profile image to Cloudinary */
    /* =================================================================== */
    const UploadProfileImage = () => {
        const data = new FormData()
        data.append('file', profileImage)
        data.append('upload_preset', 'nulltagram')
        data.append('cloud_name', 'dlvlyhpo7')
        fetch('https://api.cloudinary.com/v1_1/dlvlyhpo7/image/upload', {
            method: 'post',
            body: data
        })
        .then( res => res.json() )
        .then( data => {
            setUrl( data.url )
        })
        .catch( err => {
            console.log(err)
        })
    }

    /* =================================================================== */
    /* Creates an account */
    /* =================================================================== */
    const PostData = () => {
        if (profileImage) { 
            UploadProfileImage()
        } else {
            UploadNewUserData()
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
                    <input type='text' placeholder='name' value={ name } onChange={ (e) => setName(e.target.value) } />
                    <input type='text' placeholder='email' value={ email } onChange={ (e) => setEmail(e.target.value) } />
                    <input type='password' placeholder='password' value={ password } onChange={ (e) => setPassword(e.target.value) } />
                    <div className='file-field input-field'>
                        <div className='btn #64b5f6 blue darken-1'>
                            <span>Upload profile image</span>
                            <input type='file' onChange={ (e) => setProfileImage( e.target.files[0] ) } />
                        </div>
                        <div className='file-path-wrapper'>
                            <input className='file-path validate' type='text' />
                        </div>
                    </div>
                    <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={ () => PostData() } >
                        Sign up
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
