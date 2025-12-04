import React, { useState } from 'react'
import M from 'materialize-css'
import { useNavigate } from 'react-router-dom'
import { getAuthToken } from '../../App'
import { storage } from '../../config/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { compressImage, formatFileSize } from '../../utils/imageCompression'
import './styles/CreatePost.css'

/**
 * Name: CreatePost
 * Description: Publish an image
 */
const CreatePost = () => {
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState('')
    const [compressionInfo, setCompressionInfo] = useState(null)

    const handleImageSelect = async (e) => {
        const file = e.target.files[0]
        if (file) {
            try {
                const originalSize = file.size
                setUploadProgress('Compressing image...')
                setLoading(true)

                // Compress the image
                const compressedBlob = await compressImage(file, {
                    maxWidth: 1080,
                    maxHeight: 1080,
                    quality: 0.85
                })

                // Create a File object from the blob
                const compressedFile = new File([compressedBlob], compressedBlob.name || file.name, {
                    type: 'image/jpeg'
                })

                setImage(compressedFile)
                setImagePreview(URL.createObjectURL(compressedFile))
                setCompressionInfo({
                    original: formatFileSize(originalSize),
                    compressed: formatFileSize(compressedFile.size),
                    saved: Math.round((1 - compressedFile.size / originalSize) * 100)
                })
            } catch (err) {
                console.error('Compression error:', err)
                // Fall back to original file
                setImage(file)
                setImagePreview(URL.createObjectURL(file))
                setCompressionInfo(null)
            } finally {
                setLoading(false)
                setUploadProgress('')
            }
        }
    }

    const removeImage = () => {
        setImage(null)
        setImagePreview(null)
        setCompressionInfo(null)
    }

    /* =================================================================== */
    /* Uploads image to Firebase Storage and saves to database */
    /* =================================================================== */
    const postDetails = async () => {
        if (!title.trim()) {
            return M.toast({ html: 'Please add a title', classes: '#c62828 red darken-3' })
        }
        if (!body.trim()) {
            return M.toast({ html: 'Please add a description', classes: '#c62828 red darken-3' })
        }
        if (!image) {
            return M.toast({ html: 'Please select an image', classes: '#c62828 red darken-3' })
        }

        setLoading(true)
        try {
            // Upload to Firebase Storage
            setUploadProgress('Uploading image...')
            const fileName = `posts/${Date.now()}_${image.name}`
            const storageRef = ref(storage, fileName)

            await uploadBytes(storageRef, image)
            const imageUrl = await getDownloadURL(storageRef)

            // Save to database
            setUploadProgress('Creating post...')
            const token = await getAuthToken()
            if (!token) {
                M.toast({ html: 'Please login again', classes: '#c62828 red darken-3' })
                return
            }

            const res = await fetch('/createpost', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: title.trim(), body: body.trim(), url: imageUrl })
            })

            const data = await res.json()
            if (data.error) {
                M.toast({ html: data.error, classes: '#c62828 red darken-3' })
            } else {
                M.toast({ html: 'Posted successfully!', classes: '#2e7d32 green darken-3' })
                navigate('/')
            }
        } catch (err) {
            console.error('Post error:', err)
            if (err.code === 'storage/unauthorized') {
                M.toast({ html: 'Storage not enabled. Enable Firebase Storage in console.', classes: '#c62828 red darken-3' })
            } else {
                M.toast({ html: 'Error creating post', classes: '#c62828 red darken-3' })
            }
        } finally {
            setLoading(false)
            setUploadProgress('')
        }
    }

    /* =================================================================== */
    /* HTML */
    /* =================================================================== */
    return (
        <div className='create-post-container'>
            <div className='create-post-card'>
                <h5>Create New Post</h5>

                {/* Image Upload Area */}
                <div className='image-upload-area'>
                    {imagePreview ? (
                        <div className='image-preview'>
                            <img src={imagePreview} alt='Preview' />
                            <button className='remove-image-btn' onClick={removeImage} type='button'>
                                <X size={20} />
                            </button>
                            {compressionInfo && compressionInfo.saved > 0 && (
                                <div className='compression-info'>
                                    Compressed: {compressionInfo.original} → {compressionInfo.compressed} ({compressionInfo.saved}% saved)
                                </div>
                            )}
                        </div>
                    ) : (
                        <label className='upload-placeholder'>
                            <ImagePlus size={48} strokeWidth={1.5} />
                            <span>Click to select an image</span>
                            <input
                                type='file'
                                accept='image/*'
                                onChange={handleImageSelect}
                                style={{ display: 'none' }}
                            />
                        </label>
                    )}
                </div>

                {/* Form Fields */}
                <div className='form-fields'>
                    <input
                        type='text'
                        placeholder='Title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading}
                    />
                    <textarea
                        placeholder='Write a caption...'
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={3}
                        disabled={loading}
                    />
                </div>

                {/* Submit Button */}
                <button
                    className='submit-btn'
                    onClick={postDetails}
                    disabled={loading || !title || !body || !image}
                >
                    {loading ? (
                        <>
                            <Loader2 size={20} className='spinner' />
                            {uploadProgress}
                        </>
                    ) : (
                        'Share'
                    )}
                </button>
            </div>
        </div>
    )
}

export default CreatePost
