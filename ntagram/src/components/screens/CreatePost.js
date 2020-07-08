import React from 'react'

const CreatePost = () => {
    const [ title, setTitle ] = React.useState('')
    const [ body, setBody ] = React.useState('')
    const [ image, setImage ] = React.useState('')
    
    

    return (
        <div className='card input-filed' style={{ margin: '10px auto', maxWidth: '500px', padding: '20px', textAlign: 'center' }} >
            <input type='text' placeholder='title' value={ title } onChange={ (e) => setTitle( e.target.value ) } />
            <input type='text' placeholder='Description' value={ body } onChange={ (e) => setBody( e.target.value ) } />
            
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Select Image</span>
                    <input type="file" onChange={ (e) => console.log( e.target.files ) } />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1">
                Submit
            </button>
        </div>
    )
}

export default CreatePost
