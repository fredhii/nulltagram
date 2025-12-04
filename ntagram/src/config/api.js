// API configuration
// Read from runtime config (window.__ENV__) or fallback to build-time env vars
const getEnv = (key, defaultValue) => {
  if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[key]) {
    return window.__ENV__[key]
  }
  return import.meta.env[key] || defaultValue
}

export const API_URL = getEnv('VITE_API_URL', 'http://localhost:5001')
