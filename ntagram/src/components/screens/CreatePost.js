import React from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'

const CreatePost = () => {
    const history = useHistory()
    const [ title, setTitle ] = React.useState('')
    const [ body, setBody ] = React.useState('')
    const [ image, setImage ] = React.useState('')
    const [ url, setUrl ] = React.useState('')
    
    const postDetauls = () => {
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'nulltagram')
        data.append('cloud_name', 'dlvlyhpo7')
        fetch('https://api.cloudinary.com/v1_1/dlvlyhpo7/image/upload', {
            method: 'post',
            body: data
        })
        .then( res => res.json() )
        .then( data => {
            setUrl( data.url )
        })
        .catch( err => {
            console.log(err)
        })

        fetch('/createpost', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                body,
                url
            })
        })
        .then( res => res.json() )
        .then( data => {
            console.log(data)
            if (data.error)
                M.toast({ html: data.error, classes:'#c62828 red darken-3' })
            else {
                M.toast({ html: 'Image posted successfully', classes:'#2e7d32 green darken-3' })
                history.push('/')
            }
        })
        .catch( err => {
            console.log(err)
        })
    }

    return (
        <div className='card input-filed' style={{ margin: '10px auto', maxWidth: '500px', padding: '20px', textAlign: 'center' }} >
            <input type='text' placeholder='title' value={ title } onChange={ (e) => setTitle( e.target.value ) } />
            <input type='text' placeholder='Description' value={ body } onChange={ (e) => setBody( e.target.value ) } />
            
            <div className='file-field input-field'>
                <div className='btn #64b5f6 blue darken-1'>
                    <span>Select Image</span>
                    <input type='file' onChange={ (e) => setImage( e.target.files[0] ) } />
                </div>
                <div className='file-path-wrapper'>
                    <input className='file-path validate' type='text' />
                </div>
            </div>
            <button className='btn waves-effect waves-light #64b5f6 blue darken-1' onClick={ () => postDetauls() } >
                Submit
            </button>
        </div>
    )
}

export default CreatePost
