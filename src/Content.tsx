import { Routes, Route, Navigate } from 'react-router-dom'
import appInfo from './app-info'
import routes from './routes/app-routes'
import { SideNavOuterToolbar } from './shared/layouts'
import { Footer } from './shared/components'
import { useAuthStore } from './auth'

export const Content = (): JSX.Element => {
    const version = useAuthStore((state) => state.sessionInfo?.appVersion)
    return (
        <SideNavOuterToolbar title={appInfo.title}>
            <Routes>
                {routes.map(({ path, element }) => (
                    <Route key={path} path={path} element={element} />
                ))}
                <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
            <Footer>
                <div className="row">
                    <div className="col-sm-12 col-md-10 col-lg-10">
                        Copyright © {new Date().getFullYear()} Desarrollado por &nbsp;
                        <a target="_blank" href="https://www.solcomp.com/">
                            Soluciones Computarizadas
                        </a>{' '}
                        para &nbsp;
                        <a target="_blank" href="https://gt.linkedin.com/company/apex-global-mobility">
                            Apex Global
                        </a>{' '}
                        | {appInfo.title} | V. {version}
                    </div>
                </div>
            </Footer>
        </SideNavOuterToolbar>
    )
}
