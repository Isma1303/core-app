import { Routes, Route, Navigate } from 'react-router-dom'
import appInfo from './app-info'
import routes from './routes/app-routes'
import { SideNavOuterToolbar } from './shared/layouts'
import { Footer } from './shared/components'
import { useAuthStore } from './auth'

export const Content = (): JSX.Element => {
    return (
        <SideNavOuterToolbar
            // title={appInfo.title}
            title=""
        >
            <Routes>
                {routes.map(({ path, element: RouteComponent }) => (
                    <Route key={path} path={path} element={<RouteComponent />} />
                ))}
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
            <Footer />
        </SideNavOuterToolbar>
    )
}
