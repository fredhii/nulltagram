import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../../App'
import M from 'materialize-css'
import "./styles/Signin.css"
import "./styles/commons.css"

/**
 * Name: Signin
 * Description: Login view
 */
const Signin = () => {
    const { dispatch } = useContext(UserContext)
    const history = useHistory()
    const [ email, setEmail ] = React.useState('')
    const [ password, setPassword ] = React.useState('')

    /* =================================================================== */
    /* Try to log in */
    /* =================================================================== */
    const PostData = () => {
        // eslint-disable-next-line
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))
            return M.toast({ html: 'invalid email', classes:'#c62828 red darken-3' })
        fetch('/signin', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        .then( res => res.json() )
        .then( data => {
            if (data.error)
                M.toast({ html: data.error, classes:'#c62828 red darken-3' })
            else {
                localStorage.setItem('jwt', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                dispatch({ type: 'USER', payload: data.user })
                M.toast({ html: 'Signed in successfully', classes:'#2e7d32 green darken-3' })
                history.push('/')
            }
        })
        .catch( err => {
            console.log(err)
        })
    }

    /* =================================================================== */
    /* HTML */
    /* =================================================================== */
    return (
        <div className="container container__signin">
            <div className="container__img">
                <img width="250" alt="hero" src="https://shop.ee.co.uk/medias/iphone-11-nc-64gb-black-desktop1-Format-488?context=bWFzdGVyfHJvb3R8MTY4NjM5fGltYWdlL3BuZ3xzeXMtbWFzdGVyL3Jvb3QvaGNjL2g4Yy85NTYzMjAxOTI5MjQ2L2lwaG9uZS0xMS1uYy02NGdiLWJsYWNrLWRlc2t0b3AxX0Zvcm1hdC00ODh8MTRkOGI1NjUxMmFlYjZkMDFiYjUwZjQ1MGI1NDJhMTdmMDNjNjc0OTJhNWJkOTExZTI0YmZkNmZkMjQwZWI3OQ" />
            </div>
            
            
            <div className='mycard'>
                <div className="card auth-card input-field">
                    <h2>Nulltagram</h2>
                    <input type='text' placeholder='email' value={ email } onChange={ (e) => setEmail(e.target.value) } />
                    <input type='password' placeholder='password' value={ password } onChange={ (e) => setPassword(e.target.value) } />
                    <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick= { () => PostData() } >
                        Signin
                    </button>
                    <br />
                </div>
                <div className="card auth-card input-field">
                    <p> Don't have an account? <Link to='./signup'> <span>Sign up </span> </Link></p>
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

export default Signin
