import { useEffect } from 'react'
import { useNavigationStore } from '../../shared/stores'

export const withNavigationWatcher = (Component: React.FC<JSX.Element>, path: string): JSX.Element => {
    const WrappedComponent = (props: any): JSX.Element => {
        const setCurrentPath = useNavigationStore((state) => state.setCurrentPath)

        useEffect(() => {
            setCurrentPath(path)
        }, [setCurrentPath])
        return <Component {...props} />
    }
    return <WrappedComponent />
}
