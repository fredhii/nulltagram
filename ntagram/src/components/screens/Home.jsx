/* Dependencies */
import { API_URL } from '../../config/api'
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react'
import { UserContext, getAuthToken } from '../../App'
import { Link } from 'react-router-dom'
/* Components */
import Loading from '../common/Loading'
import Modal from '../common/Modal'
import Avatar from '../common/Avatar'
import SkeletonImage from '../common/SkeletonImage'
import M from 'materialize-css'
import { MoreHorizontal, Loader2 } from 'lucide-react'
/* Utils */
import { timeAgo } from '../../utils/timeAgo'
/* Style */
import './styles/Home.css'


/**
 * Name: Home
 * Description: Displays posts feed with infinite scroll
 */
const Home = () => {
	const [data, setData] = useState([])
	const [commentText, setCommentText] = useState({})
	const [cursor, setCursor] = useState(null)
	const [hasMore, setHasMore] = useState(true)
	const [loading, setLoading] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)
	const [loadingActions, setLoadingActions] = useState({})
	const { state } = useContext(UserContext)
	const observerRef = useRef()

	/* =================================================================== */
	/* Fetch posts with pagination */
	/* =================================================================== */
	const fetchPosts = useCallback(async (cursorParam = null) => {
		const token = await getAuthToken()
		if (!token) return

		const isInitial = !cursorParam
		if (isInitial) setLoading(true)
		else setLoadingMore(true)

		try {
			const url = cursorParam
				? `${API_URL}/allposts?limit=10&cursor=${cursorParam}`
				: `${API_URL}/allposts?limit=10`

			const res = await fetch(url, {
				headers: { 'Authorization': `Bearer ${token}` }
			})
			const result = await res.json()

			if (isInitial) {
				setData(result.posts || [])
			} else {
				setData(prev => [...prev, ...(result.posts || [])])
			}
			setCursor(result.nextCursor)
			setHasMore(result.hasMore)
		} catch (err) {
			console.error('Error fetching posts:', err)
		} finally {
			setLoading(false)
			setLoadingMore(false)
		}
	}, [])

	/* Initial fetch */
	useEffect(() => {
		fetchPosts()
	}, [fetchPosts])

	/* =================================================================== */
	/* Infinite scroll observer */
	/* =================================================================== */
	const lastPostRef = useCallback(node => {
		if (loadingMore) return
		if (observerRef.current) observerRef.current.disconnect()

		observerRef.current = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting && hasMore && !loadingMore) {
				fetchPosts(cursor)
			}
		}, { threshold: 0.1 })

		if (node) observerRef.current.observe(node)
	}, [loadingMore, hasMore, cursor, fetchPosts])

	/* =================================================================== */
	/* Like a photo */
	/* =================================================================== */
	const PostLike = async (id) => {
		if (loadingActions[`like-${id}`]) return
		setLoadingActions(prev => ({ ...prev, [`like-${id}`]: true }))

		const token = await getAuthToken()
		if (!token) return

		try {
			const res = await fetch(`${API_URL}/givelike`, {
				method: 'put',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({ postId: id }),
			})
			const result = await res.json()
			setData(prev => prev.map(item => item._id === result._id ? result : item))
		} finally {
			setLoadingActions(prev => ({ ...prev, [`like-${id}`]: false }))
		}
	}

	/* =================================================================== */
	/* Remove like from photo */
	/* =================================================================== */
	const removePostLike = async (id) => {
		if (loadingActions[`like-${id}`]) return
		setLoadingActions(prev => ({ ...prev, [`like-${id}`]: true }))

		const token = await getAuthToken()
		if (!token) return

		try {
			const res = await fetch(`${API_URL}/removelike`, {
				method: 'put',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({ postId: id }),
			})
			const result = await res.json()
			setData(prev => prev.map(item => item._id === result._id ? result : item))
		} finally {
			setLoadingActions(prev => ({ ...prev, [`like-${id}`]: false }))
		}
	}

	/* =================================================================== */
	/* Insert comment */
	/* =================================================================== */
	const insertComment = async (text, postId) => {
		if (!text.trim()) return
		if (loadingActions[`comment-${postId}`]) return
		setLoadingActions(prev => ({ ...prev, [`comment-${postId}`]: true }))

		const token = await getAuthToken()
		if (!token) return

		try {
			const res = await fetch(`${API_URL}/insert-comment`, {
				method: 'put',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({ text, postId }),
			})
			const result = await res.json()
			setData(prev => prev.map(item => item._id === result._id ? result : item))
			setCommentText(prev => ({ ...prev, [postId]: '' }))
		} catch (err) {
			console.error('Error posting comment:', err)
		} finally {
			setLoadingActions(prev => ({ ...prev, [`comment-${postId}`]: false }))
		}
	}

	/* =================================================================== */
	/* Delete post */
	/* =================================================================== */
	const deletePost = async (postId) => {
		if (loadingActions[`delete-${postId}`]) return
		setLoadingActions(prev => ({ ...prev, [`delete-${postId}`]: true }))

		const token = await getAuthToken()
		if (!token) return

		try {
			const res = await fetch(`${API_URL}/delete-post/${postId}`, {
				method: 'delete',
				headers: { 'Authorization': `Bearer ${token}` },
			})
			const result = await res.json()
			M.toast({ html: 'Deleted Successfully', classes: '#00bcd4 cyan' })
			setData(prev => prev.filter(item => item._id !== result._id))
		} catch (err) {
			M.toast({ html: 'Error', classes: '#c62828 red darken-3' })
			console.error('Error deleting post:', err)
		} finally {
			setLoadingActions(prev => ({ ...prev, [`delete-${postId}`]: false }))
		}
	}

	/* =================================================================== */
	/* HTML */
	/* =================================================================== */
	if (loading) return <Loading />

	return (
		<div className='home'>
			{data.length === 0 ? (
				<div className='no-posts'>
					<p>No posts yet. Follow some users or create your first post!</p>
				</div>
			) : (
				data.map((item, index) => (
					<div
						className='card home-card'
						key={item._id}
						ref={index === data.length - 1 ? lastPostRef : null}
					>
						{/* Post Header */}
						<div className='post-header'>
							<div className='post-header-left'>
								<Avatar src={item.postedBy?.image} alt={item.postedBy?.name} size={40} />
								<div className='post-header-info'>
									<Link to={`/profile/${item.postedBy._id}`} className='post-header-name'>
										{item.postedBy.name}
									</Link>
									<span className='post-header-time'>{timeAgo(item.createdAt)}</span>
								</div>
							</div>
							<Modal
								id={item._id}
								trigger={
									<Link to='#' className='modal-trigger post-header-menu' data-target={item._id}>
										<MoreHorizontal size={20} />
									</Link>
								}
								style={{ width: '40%', maxWidth: '400px', borderRadius: '12px' }}
								content={
									<div style={{ display: 'flex', flexDirection: 'column' }}>
										{item.postedBy._id !== state._id && (
											<button className='modal-close btn-flat'
												onClick={() => M.toast({ html: 'Coming soon...', classes: '#004d40 teal darken-4' })}
												style={{ borderBottom: '1px solid #efefef', color: '#ed4956', fontWeight: '600' }}
											>
												Unfollow
											</button>
										)}
										{item.postedBy._id === state._id && (
											<button className='modal-close btn-flat'
												onClick={() => deletePost(item._id)}
												disabled={loadingActions[`delete-${item._id}`]}
												style={{ borderBottom: '1px solid #efefef', color: '#ed4956', fontWeight: '600' }}
											>
												{loadingActions[`delete-${item._id}`] ? 'Deleting...' : 'Delete'}
											</button>
										)}
										<Link to={`/post/${item._id}`} className='modal-close btn-flat' style={{ borderBottom: '1px solid #efefef', textAlign: 'center' }}>
											Go to post
										</Link>
										<button className='modal-close btn-flat'>
											Cancel
										</button>
									</div>
								}
							/>
						</div>

						{/* Post Image */}
						<Link to={`/post/${item._id}`}>
							<SkeletonImage className='post-image' alt={item.title} src={item.picture} />
						</Link>

						{/* Post Content */}
						<div className='post-content'>
							{/* Actions */}
							<div className='post-actions'>
								{item.likes.includes(state._id) ? (
									<i
										className={`material-icons liked ${loadingActions[`like-${item._id}`] ? 'loading' : ''}`}
										onClick={() => removePostLike(item._id)}
									>
										favorite
									</i>
								) : (
									<i
										className={`material-icons ${loadingActions[`like-${item._id}`] ? 'loading' : ''}`}
										onClick={() => PostLike(item._id)}
									>
										favorite_border
									</i>
								)}
								<Link to={`/post/${item._id}`}>
									<i className='material-icons'>chat_bubble_outline</i>
								</Link>
							</div>

							{/* Likes */}
							<div className='post-likes'>{item.likes.length} likes</div>

							{/* Caption */}
							<div className='post-caption'>
								<Link to={`/profile/${item.postedBy._id}`} className='post-caption-name'>
									{item.postedBy.name}
								</Link>
								{item.body}
							</div>

							{/* Comments */}
							{item.comments.length > 0 && (
								<div className='post-comments'>
									{item.comments.length > 3 && (
										<Link to={`/post/${item._id}`} className='view-all-comments'>
											View all {item.comments.length} comments
										</Link>
									)}
									{item.comments.slice(-3).map((comment, idx) => (
										<div className='post-comment' key={idx}>
											<Link to={`/profile/${comment.postedBy._id}`} className='post-comment-name'>
												{comment.postedBy.name}
											</Link>
											{comment.text}
										</div>
									))}
								</div>
							)}

							{/* Comment Form */}
							<form className='comment-form' onSubmit={(e) => {
								e.preventDefault()
								insertComment(commentText[item._id] || '', item._id)
							}}>
								<input
									type='text'
									placeholder='Add a comment...'
									value={commentText[item._id] || ''}
									onChange={(e) => setCommentText({ ...commentText, [item._id]: e.target.value })}
									disabled={loadingActions[`comment-${item._id}`]}
								/>
								<button
									type='submit'
									disabled={!commentText[item._id]?.trim() || loadingActions[`comment-${item._id}`]}
								>
									{loadingActions[`comment-${item._id}`] ? <Loader2 size={16} className='spinner' /> : 'Post'}
								</button>
							</form>
						</div>
					</div>
				))
			)}

			{/* Loading more indicator */}
			{loadingMore && (
				<div className='loading-more'>
					<Loader2 size={24} className='spinner' />
				</div>
			)}

			{/* End of feed */}
			{!hasMore && data.length > 0 && (
				<div className='end-of-feed'>
					You've seen all posts
				</div>
			)}
		</div>
	)
}

export default Home
