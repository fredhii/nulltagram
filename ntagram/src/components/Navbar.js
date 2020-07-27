import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'

const NavBar = () => {
    const history = useHistory()
    const { state, dispatch } = useContext(UserContext)
    const renderList = () => {
        if (state) {
            return [
                <li key='profile'><Link to="/profile">Profile</Link></li>,
                <li key='create'><Link to="/create">Create post</Link></li>,
                <li key='logout'>
                    <button className="btn btn-small #c62828 red darken-3"
                        onClick= { () => {
                            localStorage.clear()
                            dispatch({ type: 'CLEAR' })
                            history.push('/signin')
                    }}>
                        Log Out
                    </button>
                </li>
            ]
        } else {
            return [
                <li key='signin'><Link to="/signin">Signin</Link></li>,
                <li key='signup'><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={ state ? '/' : '/signin' } className="brand-logo left">Nulltagram</Link>
                <ul id="nav-mobile" className="right">
                    { renderList() }
                </ul>
            </div>
      </nav>
    )
}

export default NavBar
