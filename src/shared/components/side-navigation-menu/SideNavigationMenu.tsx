import React, { useEffect, useMemo } from 'react'
import { Home, List, User, Settings, CheckSquare, Layout, ChevronRight, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import './SideNavigationMenu.scss'
import type { SideNavigationMenuProps } from '../../../types'
import { useNavigationStore } from '../../stores'

const iconMap: Record<string, React.ReactNode> = {
    home: <Home className="w-5 h-5" />,
    tasks: <CheckSquare className="w-5 h-5" />,
    profile: <User className="w-5 h-5" />,
    settings: <Settings className="w-5 h-5" />,
    administration: <Layout className="w-5 h-5" />,
}

const getIcon = (iconName?: string) => {
    if (!iconName) return <List className="w-5 h-5" />
    return iconMap[iconName.toLowerCase()] || <List className="w-5 h-5" />
}

export const SideNavigationMenu = (props: React.PropsWithChildren<SideNavigationMenuProps>) => {
    const { children, selectedItemChanged, openMenu, compactMode } = props
    const navigation = useNavigationStore((state) => state.navigation)
    const loadNavigation = useNavigationStore((state) => state.loadNavigation)
    const isLoadingPaths = useNavigationStore((state) => state.isLoadingPaths)

    useEffect(() => {
        loadNavigation()
    }, [loadNavigation])

    const items = useMemo(() => {
        return navigation.map((item) => ({
            ...item,
            path: item.path && !/^\//.test(item.path) ? `/${item.path}` : item.path,
        }))
    }, [navigation])

    return (
        <div
            className={cn('flex h-full flex-col border-r border-border bg-background transition-all duration-200', compactMode ? 'w-16' : 'w-64')}
            onMouseEnter={openMenu}
        >
            {children}
            <div className="flex-1 overflow-y-auto px-2 py-3">
                {isLoadingPaths ? (
                    <div className="flex items-center justify-center h-20">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <nav className="space-y-1">
                        {items.map((item: any, index: number) => {
                            const itemKey = item.opcion_menu_id ?? `${item.path ?? item.text_key ?? item.text ?? 'menu-item'}-${index}`

                            return (
                                <button
                                    key={itemKey}
                                    onClick={() => selectedItemChanged({ itemData: item } as any)}
                                    className={cn(
                                        'group flex w-full items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground',
                                        compactMode ? 'justify-center' : 'justify-start',
                                    )}
                                    title={compactMode ? item.text || item.text_key : ''}
                                >
                                    <span className="flex-shrink-0">{getIcon(item.icon)}</span>
                                    {!compactMode && <span className="text-sm font-medium truncate">{item.text || item.text_key}</span>}
                                    {!compactMode && item.items && item.items.length > 0 && (
                                        <ChevronRight className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100" />
                                    )}
                                </button>
                            )
                        })}
                    </nav>
                )}
            </div>

            {!compactMode && (
                <div className="mt-auto border-t border-border p-3">
                    <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                        <HelpCircle className="w-5 h-5" />
                        <span>Support</span>
                    </button>
                </div>
            )}
        </div>
    )
}
