import React, { useState } from 'react'

const SkeletonImage = ({ src, alt, className = '', style = {} }) => {
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)

    const containerClass = 'image-container ' + (loaded ? 'image-loaded' : '')

    return (
        <div className={containerClass} style={style}>
            {!error && (
                <img
                    src={src}
                    alt={alt}
                    className={className}
                    onLoad={() => setLoaded(true)}
                    onError={() => { setError(true); setLoaded(true); }}
                    style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
                />
            )}
            {!loaded && <div className='image-loading' />}
            {error && (
                <div 
                    className='image-error'
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: 'var(--bg-input)',
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                        aspectRatio: '1',
                        width: '100%'
                    }}
                >
                    Failed to load
                </div>
            )}
        </div>
    )
}

export default SkeletonImage
