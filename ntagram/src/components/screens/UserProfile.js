import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'
import Loading from '../common/Loading'


/**
 * Name: UserProfile
 * Description: Displays user profile
 */
const UserProfile = () => {
    const [ userProfile , setUserProfile ] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()

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
                            <img style={{ width:'160px', height:'160px', borderRadius:'80px' }} 
                                src={ userProfile.user.image }
                                alt=''
                            />
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
