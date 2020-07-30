import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../common/loading'


/**
 * Name: UserProfile
 * Description: Displays user profile
 */
const UserProfile = () => {
    const [ userProfile , setUserProfile ] = useState(null)
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
                                src='https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
                                alt=''
                            />
                        </div>

                        {/* Profile name */}
                        <div>
                            <h4>{ userProfile.user.name }</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '108%' }}>
                                <h6>{ userProfile.posts.length } posts</h6>
                                <h6>40 followers</h6>
                                <h6>40 following</h6>
                            </div>
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
