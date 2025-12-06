import React, { useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import { UserContext } from '../App'
import Drowpdown from './common/Dropwdown'
import Search from './common/Search'
import { Home, PlusSquare, Compass } from 'lucide-react'
import './Navbar.css'

/**
 * Name: NavBar
 * Description: User navigation bar
 */
const NavBar = () => {
	const navigate = useNavigate()
	const location = useLocation()
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

	const isActive = (path) => location.pathname === path

	/* =================================================================== */
	/* Displays login or home view */
	/* =================================================================== */
	const renderNavItems = () => {
		if (state) {
			return (
				<>
					<Link to='/' className={`nav-icon-link ${isActive('/') ? 'active' : ''}`} title='Home'>
						<Home size={24} strokeWidth={isActive('/') ? 2.5 : 1.5} />
					</Link>
					<Link to='/create' className={`nav-icon-link ${isActive('/create') ? 'active' : ''}`} title='Create'>
						<PlusSquare size={24} strokeWidth={isActive('/create') ? 2.5 : 1.5} />
					</Link>
					<Link to='/explore' className={`nav-icon-link ${isActive('/explore') ? 'active' : ''}`} title='Explore'>
						<Compass size={24} strokeWidth={isActive('/explore') ? 2.5 : 1.5} />
					</Link>
					<Drowpdown sessionOff={sessionOff} />
				</>
			)
		} else {
			return (
				<>
					<Link to='/signin' className='nav-auth-link'>
						Sign in
					</Link>
					<Link to='/signup' className='nav-auth-btn'>
						Sign up
					</Link>
				</>
			)
		}
	}

	/* =================================================================== */
	/* HTML */
	/* =================================================================== */
	return (
		<nav className='navbar'>
			<div className='navbar-container'>
				<Link to={state ? '/' : '/signin'} className='navbar-logo'>
					Nulltagram
				</Link>
				{state && <Search />}
				<div className='navbar-actions'>
					{renderNavItems()}
				</div>
			</div>
		</nav>
	)
}

export default NavBar
