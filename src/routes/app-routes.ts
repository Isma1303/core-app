import { withNavigationWatcher } from './components/navigationWatcher'
import { HomePage, ProfilePage } from '../shared/pages'
import { lazy } from 'react'

const AdministrationRoutes = lazy(() => import(/* WebpackChunkName: "administrationRoutes" */ '../administration/layouts/Administration'))
const routes = [
    {
        path: '/profile',
        element: ProfilePage,
    },
    {
        path: '/home',
        element: HomePage,
    },
    {
        path: '/administration/*',
        to: '/administration',
        element: AdministrationRoutes,
    },
]

export default routes.map((route) => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path),
    }
})
