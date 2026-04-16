import { withNavigationWatcher } from './components/navigationWatcher'
import { HomePage, ProfilePage, TasksPage } from '../shared/pages'
import { lazy } from 'react'
import IconDemo from '../components/IconDemo'

const administrationRoutes = lazy(() => import(/* WebpackChunkName: "administrationRoutes" */ '../administration/layouts/Administration'))
const routes = [
    {
        path: '/demo',
        element: IconDemo,
    },
    {
        path: '/tasks',
        element: TasksPage,
    },
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
        element: administrationRoutes,
    },
]

export default routes.map((route) => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path),
    }
})
