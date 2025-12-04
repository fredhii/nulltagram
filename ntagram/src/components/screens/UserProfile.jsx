import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext, getAuthToken } from '../../App'
import { useParams } from 'react-router-dom'
import { storage } from '../../config/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Loading from '../common/Loading'
import Modal from '../common/Modal'
import Avatar from '../common/Avatar'
import M from 'materialize-css'
import { Settings, Loader2 } from 'lucide-react'
import './styles/UserProfile.css'


/**
 * Name: UserProfile
 * Description: Displays user profile
 */
const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null)
    const [editName, setEditName] = useState('')
    const [editBio, setEditBio] = useState('')
    const [loadingAction, setLoadingAction] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()

    /* =================================================================== */
    /* Gets user images */
    /* =================================================================== */
    useEffect(() => {
        const fetchProfile = async () => {
            const token = await getAuthToken()
            if (!token) return

            const res = await fetch(`/user/${userid}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const result = await res.json()
            setUserProfile(result)
            if (result.user) {
                setEditName(result.user.name || '')
                setEditBio(result.user.bio || '')
            }
        }
        fetchProfile()
    }, [userid])

    /* =================================================================== */
    /* Follow user */
    /* =================================================================== */
    const followUser = async () => {
        if (loadingAction === 'follow') return
        setLoadingAction('follow')

        const token = await getAuthToken()
        if (!token) return

        try {
            const res = await fetch('/follow', {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ followerId: userid })
            })
            const data = await res.json()
            dispatch({ type: 'UPDATE', payload: { following: data.following, followers: data.followers } })
            localStorage.setItem('user', JSON.stringify(data))
            setUserProfile((oldState) => ({
                ...oldState,
                user: {
                    ...oldState.user,
                    followers: [...oldState.user.followers, data._id]
                }
            }))
        } finally {
            setLoadingAction(null)
        }
    }

    /* =================================================================== */
    /* Unfollow user */
    /* =================================================================== */
    const unfollowUser = async () => {
        if (loadingAction === 'unfollow') return
        setLoadingAction('unfollow')

        const token = await getAuthToken()
        if (!token) return

        try {
            const res = await fetch('/unfollow', {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ followerId: userid })
            })
            const data = await res.json()
            dispatch({ type: 'UPDATE', payload: { following: data.following, followers: data.followers } })
            localStorage.setItem('user', JSON.stringify(data))
            setUserProfile((oldState) => {
                const remainingFollowers = oldState.user.followers.filter(item => item !== data._id)
                return {
                    ...oldState,
                    user: {
                        ...oldState.user,
                        followers: remainingFollowers
                    }
                }
            })
        } finally {
            setLoadingAction(null)
        }
    }

    /* =================================================================== */
    /* Follow, Unfollow Button */
    /* =================================================================== */
    const followRender = (userProfile) => {
        if (userid === state._id) { return null }
        if (!userProfile.user.followers.includes(state._id)) {
            return (
                <button
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={followUser}
                    disabled={loadingAction === 'follow'}
                >
                    {loadingAction === 'follow' ? <Loader2 size={16} className='spinner' /> : 'Follow'}
                </button>
            )
        }
        return (
            <button
                className="btn waves-effect waves-light #f44336 red"
                onClick={unfollowUser}
                disabled={loadingAction === 'unfollow'}
            >
                {loadingAction === 'unfollow' ? <Loader2 size={16} className='spinner' /> : 'Unfollow'}
            </button>
        )
    }

    /* =================================================================== */
    /* Update profile image */
    /* =================================================================== */
    const UpdateProfileImage = async (file) => {
        if (!file) return

        try {
            M.toast({ html: 'Uploading...', classes: '#2196f3 blue' })

            // Upload to Firebase Storage
            const fileName = `avatars/${state._id}_${Date.now()}`
            const storageRef = ref(storage, fileName)

            await uploadBytes(storageRef, file)
            const imageUrl = await getDownloadURL(storageRef)

            // Update profile in backend
            const token = await getAuthToken()
            if (!token) return

            const res = await fetch('/update-profile-image', {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ image: imageUrl })
            })
            const result = await res.json()

            dispatch({ type: 'UPDATEPROFILEIMAGE', payload: result.image })
            localStorage.setItem('user', JSON.stringify({ ...state, image: result.image }))
            setUserProfile(prev => ({
                ...prev,
                user: { ...prev.user, image: result.image }
            }))
            M.toast({ html: 'Profile image updated!', classes: '#2e7d32 green darken-3' })
        } catch (err) {
            console.error('Error updating profile image:', err)
            M.toast({ html: 'Error updating image', classes: '#c62828 red darken-3' })
        }
    }

    /* =================================================================== */
    /* Update profile (name, bio) */
    /* =================================================================== */
    const updateProfile = async () => {
        if (loadingAction === 'profile') return
        setLoadingAction('profile')

        const token = await getAuthToken()
        if (!token) return

        try {
            const res = await fetch('/update-profile', {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name: editName, bio: editBio })
            })
            const result = await res.json()

            if (result.error) {
                M.toast({ html: result.error, classes: '#c62828 red darken-3' })
                return
            }

            dispatch({ type: 'UPDATE', payload: { name: result.name, bio: result.bio } })
            localStorage.setItem('user', JSON.stringify({ ...state, name: result.name, bio: result.bio }))
            setUserProfile(prev => ({
                ...prev,
                user: { ...prev.user, name: result.name, bio: result.bio }
            }))
            M.toast({ html: 'Profile updated!', classes: '#2e7d32 green darken-3' })

            // Close the modal
            const modalElem = document.getElementById('edit-profile-modal')
            const modalInstance = M.Modal.getInstance(modalElem)
            if (modalInstance) modalInstance.close()
        } catch (err) {
            console.error('Error updating profile:', err)
            M.toast({ html: 'Error updating profile', classes: '#c62828 red darken-3' })
        } finally {
            setLoadingAction(null)
        }
    }

    /* =================================================================== */
    /* HTML */
    /* =================================================================== */
    return (
        <>
            {!userProfile ?
                <Loading /> :
                <div className='user-profile'>
                    <div className='profile-header'>
                        {/* Profile photo */}
                        <div className='profile-avatar-section'>
                            {
                                userid !== state._id
                                    ? <Avatar src={userProfile.user.image} alt={userProfile.user.name} size={150} />
                                    : <Modal
                                        id={'user-profile' + state._id}
                                        trigger={
                                            <Link to='' className='waves-effect waves-light modal-trigger avatar-link' data-target={'user-profile' + state._id}>
                                                <Avatar src={userProfile.user.image} alt={userProfile.user.name} size={150} />
                                                <div className='avatar-overlay'>Change Photo</div>
                                            </Link>
                                        }
                                        style={{ width: '40%', maxWidth: '400px', borderRadius: '12px' }}
                                        content={
                                            <div className='modal-content-flex'>
                                                <div className='modal-option'>
                                                    <label htmlFor='upload-image' className='modal-option-label primary'>
                                                        Upload Photo
                                                    </label>
                                                    <input id='upload-image' type='file' accept='image/*'
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => UpdateProfileImage(e.target.files[0])} />
                                                </div>
                                                <button className='modal-close modal-option-btn'>
                                                    Cancel
                                                </button>
                                            </div>
                                        }
                                    />
                            }
                        </div>

                        {/* Profile info */}
                        <div className='profile-info'>
                            <div className='profile-name-row'>
                                <h4 className='profile-name'>{userProfile.user.name}</h4>
                                {userid === state._id && (
                                    <Modal
                                        id='edit-profile-modal'
                                        trigger={
                                            <button className='edit-profile-btn modal-trigger' data-target='edit-profile-modal'>
                                                <Settings size={20} />
                                                Edit Profile
                                            </button>
                                        }
                                        style={{ width: '400px', borderRadius: '12px' }}
                                        content={
                                            <div className='edit-profile-form'>
                                                <h5>Edit Profile</h5>
                                                <div className='input-field'>
                                                    <input
                                                        id='edit-name'
                                                        type='text'
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                    />
                                                    <label htmlFor='edit-name' className='active'>Name</label>
                                                </div>
                                                <div className='input-field'>
                                                    <textarea
                                                        id='edit-bio'
                                                        className='materialize-textarea'
                                                        value={editBio}
                                                        onChange={(e) => setEditBio(e.target.value)}
                                                        placeholder='Tell us about yourself...'
                                                    />
                                                    <label htmlFor='edit-bio' className='active'>Bio</label>
                                                </div>
                                                <div className='edit-profile-actions'>
                                                    <button className='modal-close btn-flat'>Cancel</button>
                                                    <button
                                                        className='btn waves-effect waves-light blue'
                                                        onClick={updateProfile}
                                                        disabled={loadingAction === 'profile'}
                                                    >
                                                        {loadingAction === 'profile' ? <Loader2 size={16} className='spinner' /> : 'Save'}
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                    />
                                )}
                            </div>

                            <div className='profile-stats'>
                                <span><strong>{userProfile.posts.length}</strong> posts</span>
                                <span><strong>{userProfile.user.followers.length}</strong> followers</span>
                                <span><strong>{userProfile.user.following.length}</strong> following</span>
                            </div>

                            {userProfile.user.bio && (
                                <p className='profile-bio'>{userProfile.user.bio}</p>
                            )}

                            {followRender(userProfile)}
                        </div>
                    </div>

                    {/* User published photos */}
                    <div className='profile-posts'>
                        {userProfile.posts.length === 0 ? (
                            <div className='no-posts-message'>
                                <p>No posts yet</p>
                            </div>
                        ) : (
                            <div className='gallery'>
                                {userProfile.posts.map(item => (
                                    <Link to={`/post/${item._id}`} key={item._id} className='gallery-item'>
                                        <img alt={item.title} src={item.picture} />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            }
        </>
    )
}

export default UserProfile
