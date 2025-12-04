import React, { useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { useTheme } from '../../context/ThemeContext'
import { Link } from 'react-router-dom'
import M from 'materialize-css'
import Avatar from './Avatar'
import { Moon, Sun } from 'lucide-react'

const Dropdown = (props) => {
	const { state } = useContext(UserContext) /* Get ID from logged user */
	const { isDark, toggleTheme } = useTheme()

	useEffect(() => {
		let dropdowns = document.querySelectorAll('.dropdown-trigger')
		let options = {
			inDuration: 300,
			outDuration: 225,
			coverTrigger: false,
		}
		M.Dropdown.init(dropdowns, options)
	}, [])

	return (
		<div>
			<ul>
				<li>
					<a
						className='dropdown-trigger'
						href='#!'
						data-target='dropdown1'
						style={{ display: 'flex', alignItems: 'center' }}
					>
						<Avatar src={state?.image} alt={state?.name} size={32} />
						<i className='material-icons right'>arrow_drop_down</i>
					</a>
					<ul id='dropdown1' className='dropdown-content'>
						<li>
							<Link to={ `/profile/${state._id}` }>
								Profile
							</Link>
						</li>
						<li>
							<Link to='/create'>
								New post
							</Link>
						</li>
						<li>
							<Link to='/explore'>
								Explore
							</Link>
						</li>
						<li>
							<a
								href='#!'
								onClick={(e) => { e.preventDefault(); toggleTheme(); }}
								style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
							>
								{isDark ? <Sun size={18} /> : <Moon size={18} />}
								{isDark ? 'Light' : 'Dark'}
							</a>
						</li>
						<li className='divider'></li>
						<li onClick={props.sessionOff}>
							<a href='#!'>
								Logout
							</a>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	)
}

export default Dropdown
