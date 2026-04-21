import React, { useEffect, useMemo } from 'react'
import * as LucideIcons from 'lucide-react'
import { cn } from '@/lib/utils'
import './SideNavigationMenu.scss'
import type { SideNavigationMenuProps } from '../../../types'
import { useNavigationStore } from '../../stores'

const getIcon = (iconName?: string) => {
    if (!iconName) return <LucideIcons.List className="w-5 h-5" />

    if (iconName.includes('bi-') || iconName.startsWith('bi ')) {
        return <i className={cn(iconName, 'text-[20px] w-5 h-5 flex items-center justify-center')} />
    }

    const pascalName = iconName
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('')

    const IconComponent = (LucideIcons as any)[pascalName] || (LucideIcons as any)[iconName]

    if (IconComponent) {
        return <IconComponent className="w-5 h-5" />
    }

    return <LucideIcons.List className="w-5 h-5" />
}

export const SideNavigationMenu = (props: React.PropsWithChildren<SideNavigationMenuProps>) => {
    const { children, selectedItemChanged, openMenu, compactMode } = props
    const navigation = useNavigationStore((state) => state.navigation)
    const loadNavigation = useNavigationStore((state) => state.loadNavigation)
    const isLoadingPaths = useNavigationStore((state) => state.isLoadingPaths)
    const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({})

    useEffect(() => {
        loadNavigation()
    }, [loadNavigation])

    const items = useMemo(() => {
        return navigation.map((item) => ({
            ...item,
            path: item.path && !/^\//.test(item.path) ? `/${item.path}` : item.path,
        }))
    }, [navigation])

    const toggleExpand = (key: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setExpandedItems((prev) => ({
            ...prev,
            [key]: !prev[key],
        }))
    }

    const renderMenuItem = (item: any, index: number, level = 0) => {
        const hasChildren = item.items && item.items.length > 0
        const itemKey = item.menu_option_id ?? `${item.path ?? item.text_key ?? item.text ?? 'menu-item'}-${index}`
        const isExpanded = expandedItems[itemKey]

        return (
            <React.Fragment key={itemKey}>
                <button
                    onClick={(e) => {
                        if (hasChildren && !item.path) {
                            toggleExpand(itemKey, e)
                        } else {
                            selectedItemChanged({ itemData: item } as any)
                        }
                    }}
                    className={cn(
                        'group flex w-full items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200',
                        compactMode ? 'justify-center' : 'justify-start',
                        level > 0 && !compactMode && 'pl-11',
                        isExpanded && 'bg-accent/50 text-foreground',
                    )}
                    title={compactMode ? item.text || item.text_key : ''}
                >
                    <span className="flex-shrink-0">{getIcon(item.icon)}</span>
                    {!compactMode && <span className="text-sm font-medium truncate">{item.text || item.text_key}</span>}
                    {!compactMode && hasChildren && (
                        <LucideIcons.ChevronRight
                            className={cn(
                                'w-4 h-4 ml-auto opacity-50 group-hover:opacity-100 transition-transform duration-200',
                                isExpanded && 'rotate-90 opacity-100',
                            )}
                            onClick={(e) => {
                                if (item.path) {
                                    toggleExpand(itemKey, e)
                                }
                            }}
                        />
                    )}
                </button>
                {!compactMode && hasChildren && isExpanded && (
                    <div className="mt-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        {item.items.map((subItem: any, subIndex: number) => renderMenuItem(subItem, subIndex, level + 1))}
                    </div>
                )}
            </React.Fragment>
        )
    }

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
                    <nav className="space-y-1">{items.map((item: any, index: number) => renderMenuItem(item, index))}</nav>
                )}
            </div>
        </div>
    )
}
