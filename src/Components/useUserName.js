import { useState, useEffect } from 'react'

const STORAGE_KEY = 'app_user_name'
const EVENT_NAME = 'app_user_name_updated'

export function useUserName(fallback = 'Guest') {
    const [userName, setUserName] = useState(() => {
        return localStorage.getItem(STORAGE_KEY) || fallback
    })

    useEffect(() => {
        function sync() {
            setUserName(localStorage.getItem(STORAGE_KEY) || fallback)
        }
        // Cross-tab updates
        window.addEventListener('storage', sync)
        // Same-tab updates (dispatched from Settings.jsx on save)
        window.addEventListener(EVENT_NAME, sync)
        return () => {
            window.removeEventListener('storage', sync)
            window.removeEventListener(EVENT_NAME, sync)
        }
    }, [fallback])

    return userName
}