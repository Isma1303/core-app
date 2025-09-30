import { useSystemActionPermissionsStore } from '../stores'

interface Props {
    componentId: string
    children: JSX.Element
    nonPermissionComponent?: any
}

export const SystemActionPermissionsWrapper = ({ componentId, children, nonPermissionComponent = null }: Props) => {
    const hasPermission = useSystemActionPermissionsStore((state) => state.hasPermission)

    return hasPermission(componentId) ? children : nonPermissionComponent
}
