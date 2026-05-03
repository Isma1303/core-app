import { withNavigationWatcher } from './components/navigationWatcher'
import { HomePage, ProfilePage } from '../shared/pages'
import { lazy } from 'react'
import Events from '@/ddg/layout/ddg'
import { Coffee } from '@/coffee/layouts/coffee'
import { Catalogs } from '@/coffee/layouts/catalogs'

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
    {
        path: '/events/*',
        to: '/events',
        element: Events,
    },
    {
        path: '/coffee/*',
        to: '/coffee',
        element: Coffee,
    },
    {
        path: '/catalogs/*',
        to: '/catalogs',
        element: Catalogs,
    },
]

export default routes.map((route) => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path),
    }
})
