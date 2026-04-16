import { useMemo, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './UserPanel.scss'
import type { UserPanelProps } from '../../../types'
import { useAuthStore } from '../..'

export const UserPanel = ({ menuMode }: UserPanelProps): JSX.Element => {
    const user = useAuthStore((state) => state.user)
    const deauthenticate = useAuthStore((state) => state.deauthenticate)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navigate = useNavigate()

    const navigateToProfile = useCallback(() => {
        navigate('/profile')
        setIsMenuOpen(false)
    }, [navigate])

    const logout = useCallback(() => {
        deauthenticate()
        setIsMenuOpen(false)
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
            <div className={'user-info'} onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ cursor: 'pointer' }}>
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

            {isMenuOpen && menuMode === 'context' && (
                <div style={{ position: 'absolute', top: '100%', right: 0, backgroundColor: 'white', border: '1px solid #ccc', zIndex: 1000, minWidth: '150px' }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: '0.5rem' }}>
                        {menuItems.map((item, index) => (
                            <li key={index} onClick={item.onClick} style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: index < menuItems.length - 1 ? '1px solid #eee' : 'none' }}>
                                {item.text}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {menuMode === 'list' && (
                <ul style={{ listStyle: 'none', margin: 0, padding: '0.5rem' }}>
                    {menuItems.map((item, index) => (
                        <li key={index} onClick={item.onClick} style={{ padding: '0.5rem', cursor: 'pointer' }}>
                            {item.text}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
