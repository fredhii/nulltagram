import React, { useEffect, useState, useContext } from 'react'
import { UserContext, getAuthToken } from '../../App'
import Loading from '../common/Loading'
import Avatar from '../common/Avatar'


/**
 * Name: Profile
 * Description: Displays user profile
 */
const Profile = () => {
	const [userPics, setUserPics] = useState([])
	const { state } = useContext(UserContext)

	/* =================================================================== */
	/* Gets user images */
	/* =================================================================== */
	useEffect(() => {
		const fetchMyPosts = async () => {
			const token = await getAuthToken()
			if (!token) return

			const res = await fetch('/mypost', {
				headers: { 'Authorization': `Bearer ${token}` }
			})
			const result = await res.json()
			setUserPics(result.mypost || [])
		}
		fetchMyPosts()
	}, [])

	/* =================================================================== */
	/* HTML */
	/* =================================================================== */
	return (
		<>{   
			!state
			? <Loading />
			: <div style={{ maxWidth: '700px', margin: '0px auto' }}>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-around',
						margin: '40px 0px',
						borderBottom: '1px solid grey',
					}}
				>
					{/* Profile photo */}
					<div>
						<Avatar src={state.image} alt={state.name} size={160} />
					</div>

					{/* Profile name */}
					<div>
						<h4>{ state.name }</h4>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								width: '108%',
							}}
						>
							<h6>{ userPics.length } posts</h6>
							<h6>{ state.followers.length } followers</h6>
							<h6>{ state.following.length } following</h6>
						</div>
					</div>
				</div>

				{/* User published photos */}
				<div className='gallery'>
					{userPics.map((item) => {
						return (
							<img
								className='item'
								alt={item.title}
								src={item.picture}
								key={item._id}
							/>
						)
					})}
				</div>
			</div>
		}</>
		
	)
}

export default Profile
