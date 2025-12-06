import React, { useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { useTheme } from '../../context/ThemeContext'
import { Link } from 'react-router-dom'
import M from 'materialize-css'
import Avatar from './Avatar'
import { Moon, Sun, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import './Dropdown.css'

const Dropdown = (props) => {
	const { state } = useContext(UserContext) /* Get ID from logged user */
	const { isDark, toggleTheme } = useTheme()

	useEffect(() => {
		let dropdowns = document.querySelectorAll('.dropdown-trigger')
		let options = {
			inDuration: 200,
			outDuration: 150,
			coverTrigger: false,
			constrainWidth: false,
			alignment: 'right',
		}
		M.Dropdown.init(dropdowns, options)
	}, [])

	return (
		<div className='dropdown-wrapper'>
			<a
				className='dropdown-trigger avatar-dropdown-trigger'
				href='#!'
				data-target='dropdown1'
			>
				<Avatar src={state?.image} alt={state?.name} size={32} />
				<ChevronDown size={16} className='dropdown-chevron' />
			</a>
			<ul id='dropdown1' className='dropdown-content dropdown-menu'>
				<li className='dropdown-header'>
					<Avatar src={state?.image} alt={state?.name} size={44} />
					<div className='dropdown-header-info'>
						<span className='dropdown-header-name'>{state?.name}</span>
						<span className='dropdown-header-email'>{state?.email}</span>
					</div>
				</li>
				<li className='divider'></li>
				<li>
					<Link to={`/profile/${state._id}`} className='dropdown-item'>
						<User size={18} />
						Profile
					</Link>
				</li>
				<li>
					<Link to='/settings' className='dropdown-item'>
						<Settings size={18} />
						Settings
					</Link>
				</li>
				<li>
					<a
						href='#!'
						onClick={(e) => { e.preventDefault(); toggleTheme(); }}
						className='dropdown-item'
					>
						{isDark ? <Sun size={18} /> : <Moon size={18} />}
						{isDark ? 'Light mode' : 'Dark mode'}
					</a>
				</li>
				<li className='divider'></li>
				<li onClick={props.sessionOff}>
					<a href='#!' className='dropdown-item dropdown-item-danger'>
						<LogOut size={18} />
						Log out
					</a>
				</li>
			</ul>
		</div>
	)
}

export default Dropdown
