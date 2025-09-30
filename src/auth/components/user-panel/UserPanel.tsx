import { useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ContextMenu, { Position } from 'devextreme-react/context-menu'
import List from 'devextreme-react/list'
import './UserPanel.scss'
import type { UserPanelProps } from '../../../types'
import { useAuthStore } from '../..'

export const UserPanel = ({ menuMode }: UserPanelProps): JSX.Element => {
    const user = useAuthStore((state) => state.user)
    const deauthenticate = useAuthStore((state) => state.deauthenticate)

    const navigate = useNavigate()

    const navigateToProfile = useCallback(() => {
        navigate('/profile')
    }, [navigate])

    const logout = useCallback(() => {
        deauthenticate()
    }, [deauthenticate])

    const menuItems = useMemo(
        () => [
            {
                text: 'Perfil',
                icon: 'user',
                onClick: navigateToProfile,
            },
            {
                text: 'Cerrar sesión',
                icon: 'runner',
                onClick: logout,
            },
        ],
        [navigateToProfile, logout]
    )
    return (
        <div className={'user-panel'}>
            <div className={'user-info'}>
                <div className={'image-container'}>
                    <div
                        style={{
                            background: "url('./assets/avatar.jpg') no-repeat #fff",
                            backgroundSize: 'cover',
                        }}
                        className={'user-image'}
                    />
                </div>
                <div className={'user-name'}>{user!.name}</div>
            </div>

            {menuMode === 'context' && (
                <ContextMenu items={menuItems} target={'.user-button'} showEvent={'dxclick'} width={210} cssClass={'user-menu'}>
                    <Position my={{ x: 'center', y: 'top' }} at={{ x: 'center', y: 'bottom' }} />
                </ContextMenu>
            )}
            {menuMode === 'list' && <List className={'dx-toolbar-menu-action'} items={menuItems} />}
        </div>
    )
}
