import React, { useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import M from 'materialize-css'
import Avatar from './Avatar'

const Dropdown = (props) => {
	const { state } = useContext(UserContext) /* Get ID from logged user */

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
						style={{ color: 'black', display: 'flex', alignItems: 'center' }}
					>
						<Avatar src={state?.image} alt={state?.name} size={32} />
						<i className='material-icons right'>arrow_drop_down</i>
					</a>
					<ul id='dropdown1' className='dropdown-content'>
						<li>
							<Link style={{ color: 'black' }} to={ `/profile/${state._id}` }>
								Profile
							</Link>
						</li>
						<li>
							<Link style={{ color: 'black' }} to='/create'>
								New post
							</Link>
						</li>
						<li className='divider'></li>
						<li
							style={{ color: 'black' }}
							onClick={props.sessionOff}
						>
							<a style={{ color: 'black' }} href='#!'>
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
