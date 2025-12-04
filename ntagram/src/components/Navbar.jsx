import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import { UserContext } from '../App'
import Drowpdown from './common/Dropwdown'
import Search from './common/Search'
/**
 * Name: NavBar
 * Description: User navigation bar
 */
const NavBar = () => {
	const navigate = useNavigate()
	const { state, dispatch } = useContext(UserContext)

	const sessionOff = async () => {
		try {
			await signOut(auth)
			localStorage.clear()
			dispatch({ type: 'CLEAR' })
			navigate('/signin')
		} catch (err) {
			console.error('Logout error:', err)
		}
	}
	/* =================================================================== */
	/* Displays login or home view */
	/* =================================================================== */
	const renderList = () => {
		if (state) {
			return [
				<li key='menu-dropDown'>
					<Drowpdown sessionOff={sessionOff} />
				</li>,
			]
		} else {
			return [
				<li key='signin'>
					<Link style={{ color: 'black' }} to='/signin'>
						Signin
					</Link>
				</li>,
				<li key='signup'>
					<Link style={{ color: 'black' }} to='/signup'>
						Signup
					</Link>
				</li>,
			]
		}
	}

	/* =================================================================== */
	/* HTML */
	/* =================================================================== */
	return (
		<nav>
			<div className='nav-wrapper white'>
				<div className='container'>
					<Link
						style={{ color: 'black' }}
						to={state ? '/' : '/signin'}
						className='brand-logo left'
					>
						Nulltagram
					</Link>
					{state && <Search />}
					<ul id='nav-mobile' className='right'>
						{renderList()}
					</ul>
				</div>
			</div>
		</nav>
	)
}

export default NavBar
