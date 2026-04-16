import { useScreenSizeClass } from './shared/utils/media-query'
import './app.css'
import { Content } from './Content'
import { UnauthenticatedContent } from './auth/pages/UnauthenticatedContent'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useAuthStore } from './auth'
import { Suspense, useEffect } from 'react'
import { useSystemActionPermissionsStore } from './administration/stores'
import { SuspenseFallback } from './shared/components'

const App = () => {
    const user = useAuthStore((state) => state.user)
    const loadSystemActionPermissions = useSystemActionPermissionsStore((state) => state.loadPermissions)
8
    useEffect(() => {
        if (user) {
            loadSystemActionPermissions(user.user_id)
        }
    }, [user])

    if (user) {
        return <Content />
    }

    return <UnauthenticatedContent />
}

export default function Root() {
    const screenSizeClass = useScreenSizeClass()

    return (
        <Suspense fallback={<SuspenseFallback />}>
            <BrowserRouter>
                <div className={`app ${screenSizeClass}`}>
                    <Routes>
                        <Route path="/*" element={<App />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </Suspense>
    )
}
