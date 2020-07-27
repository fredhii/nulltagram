import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'


const Home = () => {
    const [ data, setData ] = useState([])
    const { state } = useContext(UserContext) /* Get ID from logged user */

    /* =================================================================== */
    /* Get all posts */
    /* =================================================================== */
    useEffect(() => {
        fetch('/allposts', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then( res => res.json())
        .then( result => {
            setData(result.posts)
        })
    }, [])

    /* =================================================================== */
    /* Like a photo */
    /* =================================================================== */
    const PostLike = (id) => {
        fetch('/givelike', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then( res => res.json() )
        .then( result => {
            const newData = data.map( item => {
                if (item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
        })
    }

    /* =================================================================== */
    /* Remove like from photo */
    /* =================================================================== */
    const removePostLike = (id) => {
        fetch('/removelike', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })
        }).then( res => res.json() )
        .then( result => {
            const newData = data.map( item => {
                if (item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
        })
    }

    /* =================================================================== */
    /* Show like or remove like button */
    /* =================================================================== */
    const renderLike = (item) =>  {
        if ( item.likes.includes(state._id) ) {
            return <i className='material-icons clickeable' style={{ color: '#00e676' }} onClick={() => { removePostLike(item._id) }}>favorite</i>
        } else {
            return <i className='material-icons clickeable' onClick={() => { PostLike(item._id) }}>favorite_border</i>
        }
    }

    /* =================================================================== */
    /* HTML */
    /* =================================================================== */
    return (
        <div className='home'>
            {
                data.map( item => {
                    return (
                        <div className='card home-card' key={ item._id }>
                            <h5>{ item.postedBy.name }</h5>
                            <div className='card-image'>
                                <img alt='' src={ item.picture } />
                            </div>
                            <div className='card-content'>
                                { renderLike(item) }
                                <h6>{ item.likes.length } likes</h6>
                                <h6>{ item.title }</h6>
                                <p>{ item.body }</p>
                                <input type='text' placeholder='add comment here' />
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home
