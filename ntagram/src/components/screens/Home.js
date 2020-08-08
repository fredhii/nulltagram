import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import Loading from '../common/Loading'
import './styles/Home.css'
import M from 'materialize-css'

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
								{item.postedBy._id === state._id &&
									/* TODO(Fredhii): Create Modal */
									<i className='material-icons clickeable' style={{ float: 'right' }} onClick={ () => deletePost( item._id )} > delete </i>
								}
							</h5>
							<div className='card-image'>
								<img alt='' src={ item.picture } />
							</div>
							<div className='card-content'>
								{ renderLike(item) }
								<h6>{ item.likes.length } likes</h6>
								<h6>{ item.title }</h6>

								{/* TODO: Display only one comment and add show more comments button */}
								<p>{ item.body }</p>
								{
									item.comments.map( record => {
										return (
											<h6 key={ record._id }>
												<span style={{ fontWeight: '500' }}>{ record.postedBy.name } </span>
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
									<input type='text' placeholder='add comment here' />
								</form>
							</div>
						</div>
					)
				})}

													
				<div id="modal1" className="modal">
					<div className="modal-content">
						<h4 className='center-align'>Sure, do you want to delete it?</h4>
						{/* <p>A bunch of text</p> */}
					</div>
					<div className="modal-footer">
						<a href="#!" className="modal-close waves-effect waves-green btn-flat">Agree</a>
					</div>
				</div>
			</div>
		}</>
	)
}

export default Home
