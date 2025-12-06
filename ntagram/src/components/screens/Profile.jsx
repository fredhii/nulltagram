import React, { useEffect, useState, useContext } from 'react'
import { API_URL } from '../../config/api'
import { UserContext, getAuthToken } from '../../App'
import { Link } from 'react-router-dom'
import { Camera, Grid, Loader2, Settings } from 'lucide-react'
import Loading from '../common/Loading'
import Avatar from '../common/Avatar'
import SkeletonImage from '../common/SkeletonImage'
import './styles/Profile.css'

const Profile = () => {
    const [userPics, setUserPics] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const { state, dispatch } = useContext(UserContext)

    useEffect(() => {
        const fetchMyPosts = async () => {
            const token = await getAuthToken()
            if (!token) return

            try {
                const res = await fetch(`${API_URL}/mypost`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const result = await res.json()
                setUserPics(result.mypost || [])
            } catch (err) {
                console.error('Error fetching posts:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchMyPosts()
    }, [])

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        try {
            // Upload to Cloudinary
            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', 'nulltagram')
            formData.append('cloud_name', 'dlvlyhpo7')

            const uploadRes = await fetch('https://api.cloudinary.com/v1_1/dlvlyhpo7/image/upload', {
                method: 'post',
                body: formData
            })
            const uploadData = await uploadRes.json()

            // Update profile
            const token = await getAuthToken()
            const res = await fetch(`${API_URL}/update-profile-image`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ image: uploadData.url })
            })
            const data = await res.json()

            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user))
                dispatch({ type: 'USER', payload: data.user })
            }
        } catch (err) {
            console.error('Error uploading image:', err)
        } finally {
            setUploading(false)
        }
    }

    if (!state) return <Loading />

    return (
        <div className='profile-container'>
            <div className='profile-header'>
                <div className='profile-avatar-section'>
                    <div className='profile-avatar-wrapper'>
                        <Avatar src={state.image} alt={state.name} size={150} />
                        <label className='avatar-upload-btn'>
                            {uploading ? (
                                <Loader2 size={18} className='spinner' />
                            ) : (
                                <Camera size={18} />
                            )}
                            <input
                                type='file'
                                accept='image/*'
                                onChange={handleAvatarChange}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                </div>

                <div className='profile-info'>
                    <div className='profile-name-row'>
                        <h1>{state.name}</h1>
                        <Link to='/settings' className='edit-profile-btn'>
                            <Settings size={18} />
                            Edit Profile
                        </Link>
                    </div>

                    <div className='profile-stats'>
                        <div className='stat'>
                            <span className='stat-value'>{userPics.length}</span>
                            <span className='stat-label'>posts</span>
                        </div>
                        <div className='stat'>
                            <span className='stat-value'>{state.followers?.length || 0}</span>
                            <span className='stat-label'>followers</span>
                        </div>
                        <div className='stat'>
                            <span className='stat-value'>{state.following?.length || 0}</span>
                            <span className='stat-label'>following</span>
                        </div>
                    </div>

                    {state.bio && (
                        <p className='profile-bio'>{state.bio}</p>
                    )}
                </div>
            </div>

            <div className='profile-content'>
                <div className='profile-tabs'>
                    <button className='tab active'>
                        <Grid size={16} />
                        Posts
                    </button>
                </div>

                {loading ? (
                    <div className='profile-gallery'>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className='gallery-item skeleton' />
                        ))}
                    </div>
                ) : userPics.length === 0 ? (
                    <div className='empty-gallery'>
                        <Camera size={48} strokeWidth={1} />
                        <h3>No posts yet</h3>
                        <p>When you share photos, they will appear here.</p>
                        <Link to='/create' className='create-post-link'>
                            Share your first photo
                        </Link>
                    </div>
                ) : (
                    <div className='profile-gallery'>
                        {userPics.map((item) => (
                            <Link to={`/post/${item._id}`} key={item._id} className='gallery-item'>
                                <SkeletonImage src={item.picture} alt={item.title} />
                                <div className='gallery-overlay'>
                                    <span>❤️ {item.likes?.length || 0}</span>
                                    <span>💬 {item.comments?.length || 0}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile
