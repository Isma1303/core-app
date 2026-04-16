import React, { useEffect, useRef, useMemo } from 'react'
import { useScreenSize } from '../../utils/media-query'
import './SideNavigationMenu.scss'
import type { SideNavigationMenuProps } from '../../../types'
import { useNavigationStore } from '../../stores'

export const SideNavigationMenu = (props: React.PropsWithChildren<SideNavigationMenuProps>) => {
    const { children, selectedItemChanged, openMenu, compactMode } = props

    const { isLarge } = useScreenSize()

    const navigation = useNavigationStore((state) => state.navigation)
    const loadNavigation = useNavigationStore((state) => state.loadNavigation)
    const isLoadingPaths = useNavigationStore((state) => state.isLoadingPaths)

    useEffect(() => {
        loadNavigation()
    }, [])

    function normalizePath() {
        return navigation.map((item) => ({ ...item, expanded: isLarge, path: item.path && !/^\//.test(item.path) ? `/${item.path}` : item.path }))
    }

    const items = useMemo(
        normalizePath,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [navigation]
    )

    const wrapperRef = useRef<HTMLDivElement>(null)

    return (
        <div 
            className={'side-navigation-menu'} 
            ref={wrapperRef}
            onClick={(e) => openMenu(e as any)}
        >
            {children}
            <div className={'menu-container'}>
                {isLoadingPaths ? (
                    <div>Cargando...</div>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {items.map((item: any) => (
                            <li 
                                key={item.opcion_menu_id} 
                                onClick={() => selectedItemChanged({ itemData: item } as any)}
                                style={{ cursor: 'pointer', padding: '8px' }}
                            >
                                {item.text || item.text_key}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
