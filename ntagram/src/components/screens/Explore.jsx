/* Dependencies */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAuthToken } from '../../App'
/* Components */
import Loading from '../common/Loading'
import SkeletonImage from '../common/SkeletonImage'
import { RefreshCw } from 'lucide-react'
/* Style */
import './styles/Explore.css'


/**
 * Name: Explore
 * Description: Discover posts from all users
 */
const Explore = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    /* =================================================================== */
    /* Fetch explore posts */
    /* =================================================================== */
    const fetchPosts = async (isRefresh = false) => {
        const token = await getAuthToken()
        if (!token) return

        if (isRefresh) setRefreshing(true)
        else setLoading(true)

        try {
            const res = await fetch('/explore?limit=30', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const result = await res.json()
            setPosts(result.posts || [])
        } catch (err) {
            console.error('Error fetching explore posts:', err)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    /* =================================================================== */
    /* HTML */
    /* =================================================================== */
    if (loading) return <Loading />

    return (
        <div className='explore'>
            <div className='explore-header'>
                <h5>Explore</h5>
                <button
                    className='refresh-btn'
                    onClick={() => fetchPosts(true)}
                    disabled={refreshing}
                >
                    <RefreshCw size={20} className={refreshing ? 'spinning' : ''} />
                </button>
            </div>

            {posts.length === 0 ? (
                <div className='no-posts'>
                    <p>No posts to explore yet. Be the first to post!</p>
                </div>
            ) : (
                <div className='explore-grid'>
                    {posts.map(post => (
                        <Link to={`/post/${post._id}`} key={post._id} className='explore-item'>
                            <SkeletonImage src={post.picture} alt={post.title} />
                            <div className='explore-item-overlay'>
                                <span><i className='material-icons'>favorite</i> {post.likes.length}</span>
                                <span><i className='material-icons'>chat_bubble</i> {post.comments.length}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Explore
