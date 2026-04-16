import { Routes, Route, Navigate } from 'react-router-dom'
import appInfo from './app-info'
import routes from './routes/app-routes'
import { SideNavOuterToolbar } from './shared/layouts'
import { Footer } from './shared/components'
import { useAuthStore } from './auth'

export const Content = (): JSX.Element => {
    const version = useAuthStore((state) => state.sessionInfo?.appVersion)
    return (
        <>
        </>
    )
}
