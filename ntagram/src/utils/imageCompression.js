/**
 * Compresses an image file before upload
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width (default: 1080)
 * @param {number} options.maxHeight - Maximum height (default: 1080)
 * @param {number} options.quality - JPEG quality 0-1 (default: 0.8)
 * @returns {Promise<Blob>} - Compressed image blob
 */
export const compressImage = (file, options = {}) => {
    const {
        maxWidth = 1080,
        maxHeight = 1080,
        quality = 0.8
    } = options

    return new Promise((resolve, reject) => {
        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            reject(new Error('File is not an image'))
            return
        }

        const reader = new FileReader()

        reader.onload = (event) => {
            const img = new Image()

            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height)
                    width = Math.round(width * ratio)
                    height = Math.round(height * ratio)
                }

                // Create canvas and draw resized image
                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height

                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)

                // Convert to blob
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            // Add name property to blob
                            blob.name = file.name.replace(/\.[^/.]+$/, '.jpg')
                            resolve(blob)
                        } else {
                            reject(new Error('Failed to compress image'))
                        }
                    },
                    'image/jpeg',
                    quality
                )
            }

            img.onerror = () => {
                reject(new Error('Failed to load image'))
            }

            img.src = event.target.result
        }

        reader.onerror = () => {
            reject(new Error('Failed to read file'))
        }

        reader.readAsDataURL(file)
    })
}

/**
 * Formats file size to human readable string
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size string
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
