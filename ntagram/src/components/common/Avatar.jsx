import React, { useState } from 'react'
import { User } from 'lucide-react'

const Avatar = ({ src, alt = 'User', size = 40, className = '' }) => {
    const [hasError, setHasError] = useState(false)

    const containerStyle = {
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e0e0',
        flexShrink: 0
    }

    const imgStyle = {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    }

    if (!src || hasError) {
        return (
            <div style={containerStyle} className={className}>
                <User size={size * 0.6} color="#888" />
            </div>
        )
    }

    return (
        <div style={containerStyle} className={className}>
            <img
                src={src}
                alt={alt}
                style={imgStyle}
                onError={() => setHasError(true)}
            />
        </div>
    )
}

export default Avatar
