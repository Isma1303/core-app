import { useEffect } from 'react'
import { useNavigationStore } from '../../shared/stores'

export const withNavigationWatcher = (Component: React.ComponentType<any>, path: string): React.ComponentType<any> => {
    const WrappedComponent = (props: any): JSX.Element => {
        const setCurrentPath = useNavigationStore((state) => state.setCurrentPath)

        useEffect(() => {
            setCurrentPath(path)
        }, [setCurrentPath, path])

        return <Component {...props} />
    }

    return WrappedComponent
}
