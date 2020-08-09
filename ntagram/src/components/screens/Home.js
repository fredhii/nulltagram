/* Dependencies */
import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
/* Components */
import Loading from '../common/Loading'
import Modal from '../common/Modal'
import M from 'materialize-css'
/* Style */
import './styles/Home.css'


/**
 * Name: Home
 * Description: Displays a users posts
 */
const Home = () => {
	const [ data, setData ] = useState([])
	const { state } = useContext(UserContext) /* Get ID from logged user */

	/* =================================================================== */
	/* Get all posts */
	/* =================================================================== */
	useEffect(() => {
		fetch('/allposts', {
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
			},
		})
			.then( res => res.json() )
			.then( result => {
				setData(result.posts)
			})
	}, [])

	/* =================================================================== */
	/* Like a photo */
	/* =================================================================== */
	const PostLike = (id) => {
		fetch('/givelike', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
			},
			body: JSON.stringify({
				postId: id,
			}),
		})
			.then( res => res.json())
			.then( result => {
				const newData = data.map( item => {
					if (item._id === result._id) {
						return result
					} else {
						return item
					}
				})
				setData(newData)
			})
	}

	/* =================================================================== */
	/* Remove like from photo */
	/* =================================================================== */
	const removePostLike = (id) => {
		fetch('/removelike', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
			},
			body: JSON.stringify({
				postId: id,
			}),
		})
			.then( res => res.json() )
			.then( result => {
				const newData = data.map( item => {
					if (item._id === result._id) {
						return result
					} else {
						return item
					}
				})
				setData(newData)
			})
	}

	/* =================================================================== */
	/* Show like or remove like button */
	/* =================================================================== */
	const renderLike = ( item ) => {
		if (item.likes.includes(state._id)) {
            return <i className='material-icons clickeable' style={{ color: '#00e676' }} onClick={() => { removePostLike(item._id) }}>favorite</i>
		}
		return <i className='material-icons clickeable' onClick={() => { PostLike(item._id) }}>favorite_border</i>
	}

	/* =================================================================== */
	/* Insert comment */
	/* =================================================================== */
	const insertComment = ( text, postId ) => {
		fetch('/insert-comment', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
			},
			body: JSON.stringify({ text, postId }),
		})
			.then( res => res.json() )
			.then( result => {
				const newData = data.map((item) => {
					if (item._id === result._id) {
						return result
					} else {
						return item
					}
				})
				setData(newData)
			})
			.catch( err => {
				console.log(err)
			})
	}

	/* =================================================================== */
	/* Delete post */
	/* =================================================================== */
	const deletePost = ( postId ) => {
		fetch(`/delete-post/${ postId }`, {
			method: 'delete',
			headers: {
				'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
			},
		})
			.then( res => res.json() )
			.then( result => {
				M.toast({
					html: 'Deleted Successfully',
					classes: '#00bcd4 cyan',
				})
				const newData = data.filter( item => {
					return item._id !== result._id
				})
				setData(newData)
			})
			.catch( err => {
				M.toast({ html: 'Error', classes: '#c62828 red darken-3' })
				console.log(err)
			})
	}

	/* =================================================================== */
	/* Profile pic */
	/* =================================================================== */
	const userInfo = (item) => {
		return (
			<>
				<img
					className='profile-img'
					alt='profile pic'
					src={ item.postedBy.image }
				/>
				<Link to={ `/profile/${item.postedBy._id}` } className='clickeable' >{ item.postedBy.name }</Link>
			</>
		)
	}

	/* =================================================================== */
	/* HTML */
	/* =================================================================== */
    return (
        <>{
            !data ?
            <Loading /> :
			<div className='home'>
				{data.map( item => {
					return (
						<div className='card home-card' key={item._id}>
							<h5>
								{ userInfo(item) }
								<div style={{ float: 'right' }}>
									<Modal
										id={ item._id }
										trigger={
											<Link to='#' className='waves-effect waves-light modal-trigger' data-target={ item._id }>
												<i className='material-icons' style={{ color: '#3C6E71', float: 'right', fontSize: '120%' }}> menu </i>
											</Link>
										}
										style={{ width: '40%', borderRadius: '10px' }}
										content={
											<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
												<Link to='#' className='modal-close btn-flat'
													onClick={ () => { M.toast({ html: 'Not ready yet, we\'re working on it...', classes: '#004d40 teal darken-4' }) }}
													style={{
														borderBottom: '1px solid #D9D9D9',
														width: '100%',
														textAlign: 'center',
														color: 'red',
														fontWeight: 'bold',
													}}
												> Unfollow </Link>
												{
													item.postedBy._id === state._id &&
													<Link to='#' className='modal-close waves-effect waves-teal btn-flat'
														style={{
															borderBottom: '1px solid #D9D9D9',
															width: '100%',
															textAlign: 'center',
														}}
														onClick={() => {
															/* TODO: Add a modal to confirm */
															deletePost( item._id )
														}}
													> Delete </Link>
												}
												<Link to='#' className='modal-close btn-flat'
													style={{
														borderBottom: '1px solid #D9D9D9',
														width: '100%',
														textAlign: 'center',
													}}
													onClick={ () => { M.toast({ html: 'Not ready yet, we\'re working on it...', classes: '#004d40 teal darken-4' }) }}
												> Go to post </Link>
												<Link to='#' className='modal-close waves-effect btn-flat' style={{ width: '100%', textAlign: 'center' }}>
													Cancel
												</Link>
											</div>
										}
									/>
								</div>
							</h5>
							<div className='card-image'>
								<img alt='' src={ item.picture } />
							</div>
							<div className='card-content'>
								{ renderLike(item) }
								<h6  style={{ fontWeight: '700', marginTop: '4px' }} >{ item.likes.length } likes</h6>
								<h6>
									<Link to={ `/profile/${item.postedBy._id}` } style={{ fontWeight: '700' }} className='clickeable' >{ item.postedBy.name } </Link>
									<span>{ item.body }</span>
								</h6>

								{/* TODO: Display only one comment and add show more comments button */}
								{
									item.comments.map( record => {
										return (
											<h6 key={ record._id }>
												<Link to={ `/profile/${record.postedBy._id}` } style={{ fontWeight: '700' }} className='clickeable' >{ record.postedBy.name } </Link>
												<span>{ record.text }</span>
											</h6>
										)
									})
								}
								<form onSubmit={ (e) => {
									e.preventDefault()
									/* TODO: Delete a comment */
									insertComment(e.target[0].value, item._id)
									e.target.reset();
								}} >
									<input type='text' placeholder='Add a comment...' />
								</form>
							</div>
						</div>
					)
				})}
			</div>
		}</>
	)
}

export default Home
