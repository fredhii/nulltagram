/* Dependencies */
import { API_URL } from '../../config/api'
import React, { useState, useEffect, useContext } from 'react'
import { UserContext, getAuthToken } from '../../App'
import { Link, useParams, useNavigate } from 'react-router-dom'
/* Components */
import Loading from '../common/Loading'
import Avatar from '../common/Avatar'
import SkeletonImage from '../common/SkeletonImage'
import M from 'materialize-css'
import { ArrowLeft, Trash2, Loader2 } from 'lucide-react'
/* Utils */
import { timeAgo } from '../../utils/timeAgo'
/* Style */
import './styles/PostDetail.css'


/**
 * Name: PostDetail
 * Description: Displays a single post with all comments
 */
const PostDetail = () => {
	const [post, setPost] = useState(null)
	const [loading, setLoading] = useState(true)
	const [commentText, setCommentText] = useState('')
	const [loadingActions, setLoadingActions] = useState({})
	const { state } = useContext(UserContext)
	const { postId } = useParams()
	const navigate = useNavigate()

	/* =================================================================== */
	/* Fetch post */
	/* =================================================================== */
	useEffect(() => {
		const fetchPost = async () => {
			const token = await getAuthToken()
			if (!token) return

			try {
				const res = await fetch(`${API_URL}/post/${postId}`, {
					headers: { 'Authorization': `Bearer ${token}` }
				})
				if (!res.ok) {
					navigate('/')
					return
				}
				const result = await res.json()
				setPost(result.post)
			} catch (err) {
				console.error('Error fetching post:', err)
				navigate('/')
			} finally {
				setLoading(false)
			}
		}
		fetchPost()
	}, [postId, navigate])

	/* =================================================================== */
	/* Like a photo */
	/* =================================================================== */
	const PostLike = async () => {
		if (loadingActions.like) return
		setLoadingActions(prev => ({ ...prev, like: true }))

		const token = await getAuthToken()
		if (!token) return

		try {
			const res = await fetch(`${API_URL}/givelike`, {
				method: 'put',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({ postId: post._id }),
			})
			const result = await res.json()
			setPost(result)
		} finally {
			setLoadingActions(prev => ({ ...prev, like: false }))
		}
	}

	/* =================================================================== */
	/* Remove like from photo */
	/* =================================================================== */
	const removePostLike = async () => {
		if (loadingActions.like) return
		setLoadingActions(prev => ({ ...prev, like: true }))

		const token = await getAuthToken()
		if (!token) return

		try {
			const res = await fetch(`${API_URL}/removelike`, {
				method: 'put',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({ postId: post._id }),
			})
			const result = await res.json()
			setPost(result)
		} finally {
			setLoadingActions(prev => ({ ...prev, like: false }))
		}
	}

	/* =================================================================== */
	/* Insert comment */
	/* =================================================================== */
	const insertComment = async (e) => {
		e.preventDefault()
		if (!commentText.trim()) return
		if (loadingActions.comment) return
		setLoadingActions(prev => ({ ...prev, comment: true }))

		const token = await getAuthToken()
		if (!token) return

		try {
			const res = await fetch(`${API_URL}/insert-comment`, {
				method: 'put',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({ text: commentText, postId: post._id }),
			})
			const result = await res.json()
			setPost(result)
			setCommentText('')
		} catch (err) {
			console.error('Error posting comment:', err)
		} finally {
			setLoadingActions(prev => ({ ...prev, comment: false }))
		}
	}

	/* =================================================================== */
	/* Delete comment */
	/* =================================================================== */
	const deleteComment = async (commentIndex) => {
		if (loadingActions[`delete-${commentIndex}`]) return
		setLoadingActions(prev => ({ ...prev, [`delete-${commentIndex}`]: true }))

		const token = await getAuthToken()
		if (!token) return

		try {
			const res = await fetch(`${API_URL}/delete-comment/${post._id}/${commentIndex}`, {
				method: 'delete',
				headers: { 'Authorization': `Bearer ${token}` },
			})
			const result = await res.json()
			setPost(result)
			M.toast({ html: 'Comment deleted', classes: '#00bcd4 cyan' })
		} catch (err) {
			M.toast({ html: 'Error deleting comment', classes: '#c62828 red darken-3' })
			console.error('Error deleting comment:', err)
		} finally {
			setLoadingActions(prev => ({ ...prev, [`delete-${commentIndex}`]: false }))
		}
	}

	/* =================================================================== */
	/* Delete post */
	/* =================================================================== */
	const deletePost = async () => {
		if (loadingActions.deletePost) return
		setLoadingActions(prev => ({ ...prev, deletePost: true }))

		const token = await getAuthToken()
		if (!token) return

		try {
			await fetch(`${API_URL}/delete-post/${post._id}`, {
				method: 'delete',
				headers: { 'Authorization': `Bearer ${token}` },
			})
			M.toast({ html: 'Deleted Successfully', classes: '#00bcd4 cyan' })
			navigate('/')
		} catch (err) {
			M.toast({ html: 'Error', classes: '#c62828 red darken-3' })
			console.error('Error deleting post:', err)
		} finally {
			setLoadingActions(prev => ({ ...prev, deletePost: false }))
		}
	}

	/* =================================================================== */
	/* HTML */
	/* =================================================================== */
	if (loading) return <Loading />
	if (!post) return null

	return (
		<div className='post-detail'>
			{/* Back button */}
			<button className='back-button' onClick={() => navigate(-1)}>
				<ArrowLeft size={24} />
			</button>

			<div className='post-detail-container'>
				{/* Post Image */}
				<div className='post-detail-image-container'>
					<SkeletonImage className='post-detail-image' alt={post.title} src={post.picture} />
				</div>

				{/* Post Info */}
				<div className='post-detail-info'>
					{/* Header */}
					<div className='post-detail-header'>
						<div className='post-detail-header-left'>
							<Avatar src={post.postedBy?.image} alt={post.postedBy?.name} size={32} />
							<Link to={`/profile/${post.postedBy._id}`} className='post-detail-username'>
								{post.postedBy.name}
							</Link>
						</div>
						{post.postedBy._id === state._id && (
							<button
								className='delete-post-btn'
								onClick={deletePost}
								disabled={loadingActions.deletePost}
							>
								{loadingActions.deletePost ? <Loader2 size={18} className='spinner' /> : <Trash2 size={18} />}
							</button>
						)}
					</div>

					{/* Comments Section */}
					<div className='post-detail-comments'>
						{/* Caption as first comment */}
						<div className='post-detail-comment'>
							<Avatar src={post.postedBy?.image} alt={post.postedBy?.name} size={32} />
							<div className='comment-content'>
								<Link to={`/profile/${post.postedBy._id}`} className='comment-username'>
									{post.postedBy.name}
								</Link>
								<span className='comment-text'>{post.body}</span>
								<span className='comment-time'>{timeAgo(post.createdAt)}</span>
							</div>
						</div>

						{/* All comments */}
						{post.comments.map((comment, idx) => (
							<div className='post-detail-comment' key={idx}>
								<Avatar src={comment.postedBy?.image} alt={comment.postedBy?.name} size={32} />
								<div className='comment-content'>
									<Link to={`/profile/${comment.postedBy._id}`} className='comment-username'>
										{comment.postedBy.name}
									</Link>
									<span className='comment-text'>{comment.text}</span>
									<span className='comment-time'>{timeAgo(comment.createdAt)}</span>
								</div>
								{(comment.postedBy._id === state._id || post.postedBy._id === state._id) && (
									<button
										className='delete-comment-btn'
										onClick={() => deleteComment(idx)}
										disabled={loadingActions[`delete-${idx}`]}
									>
										{loadingActions[`delete-${idx}`] ? <Loader2 size={14} className='spinner' /> : <Trash2 size={14} />}
									</button>
								)}
							</div>
						))}
					</div>

					{/* Actions */}
					<div className='post-detail-actions'>
						<div className='action-buttons'>
							{post.likes.includes(state._id) ? (
								<i
									className={`material-icons liked ${loadingActions.like ? 'loading' : ''}`}
									onClick={removePostLike}
								>
									favorite
								</i>
							) : (
								<i
									className={`material-icons ${loadingActions.like ? 'loading' : ''}`}
									onClick={PostLike}
								>
									favorite_border
								</i>
							)}
						</div>
						<div className='likes-count'>{post.likes.length} likes</div>
						<div className='post-time'>{timeAgo(post.createdAt)}</div>
					</div>

					{/* Comment Form */}
					<form className='post-detail-comment-form' onSubmit={insertComment}>
						<input
							type='text'
							placeholder='Add a comment...'
							value={commentText}
							onChange={(e) => setCommentText(e.target.value)}
							disabled={loadingActions.comment}
						/>
						<button
							type='submit'
							disabled={!commentText.trim() || loadingActions.comment}
						>
							{loadingActions.comment ? <Loader2 size={16} className='spinner' /> : 'Post'}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}

export default PostDetail
