import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'

/**
 * Name: Profile
 * Description: Displays user profile
 */
const Profile = () => {
    const [ userPics , setUserPics ] = useState([])
    const { state } = useContext(UserContext)

    /* =================================================================== */
    /* Gets user images */
    /* =================================================================== */
    useEffect(() => {
        fetch('/mypost', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        }).then( res => res.json() )
        .then(result => { setUserPics(result.mypost) })
    }, [])

    /* =================================================================== */
    /* HTML */
    /* =================================================================== */
    return (
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
                    <h4>{ state ? state.name : 'loading...' }</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '108%' }}>
                        <h6>40 posts</h6>
                        <h6>40 followers</h6>
                        <h6>40 following</h6>
                    </div>
                </div>
            </div>

            {/* User published photos */}
            <div className='gallery'>
                {
                    userPics.map( item => {
                        return (
                            <img className='item' alt={ item.title } src={ item.picture } key={ item._id } />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Profile
