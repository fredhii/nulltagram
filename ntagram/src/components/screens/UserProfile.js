import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'
import Loading from '../common/Loading'
import Modal from '../common/Modal'



/**
 * Name: UserProfile
 * Description: Displays user profile
 */
const UserProfile = () => {
    const [ userProfile , setUserProfile ] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    const [ profileImage, setProfileImage ] = useState('')

    /* =================================================================== */
    /* Gets user images */
    /* =================================================================== */
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        }).then( res => res.json() )
        .then(result => {
            setUserProfile(result)
        })
    }, [ userid ])

    /* =================================================================== */
    /* Follow user */
    /* =================================================================== */
    const followUser = () => {
        fetch('/follow', {
            method: 'put',
            headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
            },
            body: JSON.stringify({
                followerId: userid
            })
        }).then( res => res.json() )
        .then( data => {
            dispatch({ type: 'UPDATE', payload: { following: data.following, followers: data.followers } })
            localStorage.setItem('user', JSON.stringify(data))
            setUserProfile((oldState) => {
                return {
                    ...oldState,
                    user: {
                        ...oldState.user,
                        followers: [ ...oldState.user.followers, data._id ]
                    }
                }
            })
        })
    }

    /* =================================================================== */
    /* Unfollow user */
    /* =================================================================== */
    const unfollowUser = () => {
        fetch('/unfollow', {
            method: 'put',
            headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
            },
            body: JSON.stringify({
                followerId: userid
            })
        }).then( res => res.json() )
        .then( data => {
            dispatch({ type: 'UPDATE', payload: { following: data.following, followers: data.followers } })
            localStorage.setItem('user', JSON.stringify(data))
            setUserProfile((oldState) => {
                const remainingFollowers = oldState.user.followers.filter(item => item !== data._id )
                return {
                    ...oldState,
                    user: {
                        ...oldState.user,
                        followers: remainingFollowers
                    }
                }
            })
        })
    }

    /* =================================================================== */
    /* Follow, Unfollow Button */
    /* =================================================================== */
    const followRender = ( userProfile ) => {
        if (userid === state._id) { return }
        if (!userProfile.user.followers.includes(state._id)) {
            return <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick= { () => followUser() } > Follow </button>
        }
        return <button className="btn waves-effect waves-light #f44336 red" onClick= { () => unfollowUser() } > Unfollow </button>
    }

    /* =================================================================== */
    /* Update profile image */
    /* =================================================================== */
    const UpdateProfileImage = (file) => {
        setProfileImage(file)
    }
    useEffect(() => {
        if (profileImage) {
            const data = new FormData()
            data.append('file', profileImage)
            data.append('upload_preset', 'nulltagram')
            data.append('cloud_name', 'dlvlyhpo7')
            fetch('https://api.cloudinary.com/v1_1/dlvlyhpo7/image/upload', {
                method: 'post',
                body: data
            })
            .then( res => res.json() )
            .then( data => {
                fetch('/update-profile-image', {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
                    },
                    body: JSON.stringify({ image: data.url })
                }).then( res => res.json() )
                .then( result => {
                    dispatch({ type: 'UPDATEPROFILEIMAGE', payload: result.image })
                    localStorage.setItem('user', JSON.stringify({ ...state, image: result.image }))
                    window.location.reload()
                })
                .catch( err => {
                    console.log(err)
                })
            })
        }
    }, [ profileImage, state, dispatch ])

    /* =================================================================== */
    /* HTML */
    /* =================================================================== */
    return (
        <>
            {   !userProfile ?
                <Loading /> :
                <div style={{ maxWidth: '700px', margin: '0px auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', margin: '40px 0px', borderBottom: '1px solid grey' }}>
                        {/* Profile photo */}
                        <div>
                            {
                                userid !== state._id
                                ?   <img style={{ width:'160px', height:'160px', borderRadius:'80px' }} 
                                        src={ userProfile.user.image }
                                        alt=''
                                    />
                                :   <Modal 
                                        id={'user-profile' + state._id}
                                        trigger={
                                            <Link to='' className='waves-effect waves-light modal-trigger' data-target={'user-profile' + state._id}>
                                                <img style={{ width:'160px', height:'160px', borderRadius:'80px' }} 
                                                    src={ userProfile.user.image }
                                                    alt=''
                                                />
                                            </Link>
                                        }
                                        style={{ width: '40%', borderRadius: '10px' }}
                                        content={
											<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <div className='modal-close btn-flat #006064 cyan-text darken-4'
                                                    style={{
														borderBottom: '1px solid #D9D9D9',
														width: '100%',
                                                        textAlign: 'center',
                                                        borderBottomWidth: '1',
                                                    }}
                                                    >
                                                    <label htmlFor='upload-image'
                                                        className='clickeable #006064 cyan-text darken-4'
                                                        style={{ 
                                                            fontWeight: 'bold' ,
                                                            fontSize: '14px'
                                                        }}
                                                    >Update profile image
                                                    </label>
                                                    <input id='upload-image' type='file' 
                                                        style={{ display: 'none' }}
                                                    onChange={ (e) => UpdateProfileImage( e.target.files[0] ) } />
                                                </div>
												<Link to='#' className='modal-close waves-effect btn-flat' style={{ width: '100%', textAlign: 'center' }}>
													Cancel
												</Link>
                                            </div>
                                        }
                                    />
                            }
                        </div>

                        {/* Profile name */}
                        <div>
                            <h4>{ userProfile.user.name }</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '108%' }}>
                                <h6>{ userProfile.posts.length } posts</h6>
                                <h6>{ userProfile.user.followers.length } followers</h6>
                                <h6>{ userProfile.user.following.length } following</h6>
                            </div>
                            
                            { followRender(userProfile) }
                        </div>
                    </div>
                    
                    {/* User published photos */}
                    <div className='gallery'>
                        {
                            userProfile.posts.map( item => {
                                return (
                                    <img className='item' alt={ item.title } src={ item.picture } key={ item._id } />
                                )
                            })
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default UserProfile
