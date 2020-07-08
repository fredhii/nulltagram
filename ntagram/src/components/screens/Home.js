import React from 'react'

const Home = () => {
    return (
        <div className='home'>
            <div className='card home-card'>
                <h5>user name</h5>
                <div className='card-image'>
                    <img alt='' src='https://images.unsplash.com/photo-1531342627655-673320198dc4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' />
                </div>
                <div className='card-content'>
                    <i className='material-icons' >favorite_border</i>
                    <h6>title</h6>
                    <p>post description</p>
                    <input type='text' placeholder='add comment here' />
                </div>
            </div>
            {/* 2 */}
            <div className='card home-card'>
                <h5>user name</h5>
                <div className='card-image'>
                    <img alt='' src='https://images.unsplash.com/photo-1531342627655-673320198dc4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' />
                </div>
                <div className='card-content'>
                    <i className='material-icons' >favorite_border</i>
                    <h6>title</h6>
                    <p>post description</p>
                    <input type='text' placeholder='add comment here' />
                </div>
            </div>
            {/* 3 */}
            <div className='card home-card'>
                <h5>user name</h5>
                <div className='card-image'>
                    <img alt='' src='https://images.unsplash.com/photo-1531342627655-673320198dc4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' />
                </div>
                <div className='card-content'>
                    <i className='material-icons' >favorite_border</i>
                    <h6>title</h6>
                    <p>post description</p>
                    <input type='text' placeholder='add comment here' />
                </div>
            </div>
        </div>
    )
}

export default Home
