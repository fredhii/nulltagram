import React, { useState, useEffect, useRef } from 'react'
import { API_URL } from '../../config/api'
import { Link } from 'react-router-dom'
import { Search as SearchIcon, X, Loader2 } from 'lucide-react'
import { getAuthToken } from '../../App'
import Avatar from './Avatar'
import './Search.css'

const Search = () => {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const searchRef = useRef(null)
    const debounceRef = useRef(null)

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowResults(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Debounced search
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)

        if (query.length < 2) {
            setResults([])
            setLoading(false)
            return
        }

        setLoading(true)
        debounceRef.current = setTimeout(async () => {
            try {
                const token = await getAuthToken()
                if (!token) return

                const res = await fetch(`${API_URL}/search-users?q=${encodeURIComponent(query)}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const data = await res.json()
                setResults(data.users || [])
            } catch (err) {
                console.error('Search error:', err)
                setResults([])
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [query])

    const handleClear = () => {
        setQuery('')
        setResults([])
    }

    const handleResultClick = () => {
        setShowResults(false)
        setQuery('')
        setResults([])
    }

    return (
        <div className='search-container' ref={searchRef}>
            <div className='search-input-wrapper'>
                <SearchIcon size={16} className='search-icon' />
                <input
                    type='text'
                    placeholder='Search'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowResults(true)}
                    className='search-input'
                />
                {query && (
                    <button className='search-clear' onClick={handleClear}>
                        {loading ? <Loader2 size={16} className='spinner' /> : <X size={16} />}
                    </button>
                )}
            </div>

            {showResults && query.length >= 2 && (
                <div className='search-results'>
                    {loading ? (
                        <div className='search-loading'>
                            <Loader2 size={20} className='spinner' />
                        </div>
                    ) : results.length === 0 ? (
                        <div className='search-no-results'>No results found.</div>
                    ) : (
                        results.map(user => (
                            <Link
                                key={user._id}
                                to={`/profile/${user._id}`}
                                className='search-result-item'
                                onClick={handleResultClick}
                            >
                                <Avatar src={user.image} alt={user.name} size={44} />
                                <span className='search-result-name'>{user.name}</span>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default Search
