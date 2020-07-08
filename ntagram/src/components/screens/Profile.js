import React from 'react'

const Profile = () => {
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
                    <h4>Profile name</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '108%' }}>
                        <h6>40 posts</h6>
                        <h6>40 followers</h6>
                        <h6>40 following</h6>
                    </div>
                </div>
            </div>
            <div className='gallery'>
                <img className='item' alt='' src='https://images.unsplash.com/photo-1503442862980-50ccb3f1d085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' />
                <img className='item' alt='' src='https://images.unsplash.com/photo-1503442862980-50ccb3f1d085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' />
                <img className='item' alt='' src='https://images.unsplash.com/photo-1503442862980-50ccb3f1d085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' />
                <img className='item' alt='' src='https://images.unsplash.com/photo-1503442862980-50ccb3f1d085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' />
                <img className='item' alt='' src='https://images.unsplash.com/photo-1503442862980-50ccb3f1d085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' />
                <img className='item' alt='' src='https://images.unsplash.com/photo-1503442862980-50ccb3f1d085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' />
            </div>
        </div>
    )
}

export default Profile
