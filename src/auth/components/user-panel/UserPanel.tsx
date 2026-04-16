import { useMemo, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User as UserIcon, LogOut, Settings, ChevronDown } from 'lucide-react'
import './UserPanel.scss'
import type { UserPanelProps } from '../../../types'
import { useAuthStore } from '../..'
import { cn } from '@/lib/utils'

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
                icon: <UserIcon className="w-4 h-4" />,
                onClick: navigateToProfile,
            },
            {
                text: 'Configuración',
                icon: <Settings className="w-4 h-4" />,
                onClick: () => setIsMenuOpen(false),
            },
            {
                text: 'Cerrar sesión',
                icon: <LogOut className="w-4 h-4" />,
                onClick: logout,
            },
        ],
        [navigateToProfile, logout]
    )

    return (
        <div className="relative user-panel">
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 p-1 transition-colors rounded-full hover:bg-accent group"
            >
                <div className="relative w-8 h-8 overflow-hidden rounded-full border border-border">
                    <img 
                        src="./assets/avatar.jpg" 
                        alt={user!.name} 
                        className="object-cover w-full h-full"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user!.name)
                        }}
                    />
                </div>
                <div className="flex flex-col items-start hidden mr-2 text-left md:flex">
                    <span className="text-sm font-medium leading-none text-foreground">{user!.name}</span>
                    <span className="text-xs leading-none text-muted-foreground">Admin</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform text-muted-foreground", isMenuOpen && "rotate-180")} />
            </button>

            {isMenuOpen && menuMode === 'context' && (
                <>
                    <div 
                        className="fixed inset-0 z-40 bg-transparent" 
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute right-0 z-50 w-56 mt-2 overflow-hidden bg-popover text-popover-foreground border rounded-lg shadow-lg border-border animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-2 border-b border-border bg-muted/50">
                            <p className="text-sm font-medium">{user!.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user!.email || 'admin@example.com'}</p>
                        </div>
                        <div className="p-1">
                            {menuItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={item.onClick}
                                    className="flex items-center w-full gap-2 px-3 py-2 text-sm transition-colors rounded-md hover:bg-accent hover:text-accent-foreground group"
                                >
                                    <span className="opacity-70 group-hover:opacity-100">{item.icon}</span>
                                    <span>{item.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
