import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../../App'
import M from 'materialize-css'

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
        <div className='mycard'>
            <div className="card auth-card input-field">
                <h2>Nulltagram</h2>
                <input type='text' placeholder='email' value={ email } onChange={ (e) => setEmail(e.target.value) } />
                <input type='password' placeholder='password' value={ password } onChange={ (e) => setPassword(e.target.value) } />
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick= { () => PostData() } >
                    Signin
                </button>
                <br />
                <p> Don't have an account? <Link to='./signup'> Sign up </Link></p>
            </div>
        </div>
    )
}

export default Signin
