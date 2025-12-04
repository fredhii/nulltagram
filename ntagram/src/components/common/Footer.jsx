import React from 'react'
import { Heart } from 'lucide-react'
import packageJson from '../../../package.json'
import './Footer.css'

const Footer = () => {
    return (
        <footer className='app-footer'>
            <span>
                Made with <Heart size={14} className='heart-icon' fill='currentColor' /> by{' '}
                <a href='https://linkedin.com/in/fredhii' target='_blank' rel='noopener noreferrer'>
                    Fredhii
                </a>
            </span>
            <span className='version'>v{packageJson.version}</span>
        </footer>
    )
}

export default Footer
