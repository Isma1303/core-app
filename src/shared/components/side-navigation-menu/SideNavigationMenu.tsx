import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { TreeView, TreeViewRef } from 'devextreme-react/tree-view'
import { useScreenSize } from '../../utils/media-query'
import './SideNavigationMenu.scss'
import type { SideNavigationMenuProps } from '../../../types'

import * as events from 'devextreme/events'
import { useNavigationStore } from '../../stores'
import { LoadIndicator } from 'devextreme-react'

export const SideNavigationMenu = (props: React.PropsWithChildren<SideNavigationMenuProps>) => {
    const { children, selectedItemChanged, openMenu, compactMode, onMenuReady } = props

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

    const currentPath = useNavigationStore((state) => state.currentPath)

    const treeViewRef = useRef<TreeViewRef>(null)
    const wrapperRef = useRef<HTMLDivElement>()
    const getWrapperRef = useCallback(
        (element: HTMLDivElement) => {
            const prevElement = wrapperRef.current
            if (prevElement) {
                events.off(prevElement, 'dxclick')
            }

            wrapperRef.current = element
            events.on(element, 'dxclick', (e: React.PointerEvent) => {
                openMenu(e)
            })
        },
        [openMenu]
    )

    useEffect(() => {
        const treeView = treeViewRef.current && treeViewRef.current.instance()
        if (!treeView) {
            return
        }

        if (currentPath !== undefined) {
            treeView.selectItem(currentPath)
            treeView.expandItem(currentPath)
        }

        if (compactMode) {
            treeView.collapseAll()
        }
    }, [currentPath, compactMode])

    return (
        <div className={'dx-swatch-additional side-navigation-menu'} ref={getWrapperRef}>
            {children}
            <div className={'menu-container'}>
                {isLoadingPaths ? (
                    <LoadIndicator id="large-indicator" height={60} width={60} />
                ) : (
                    <TreeView
                        ref={treeViewRef}
                        items={items}
                        dataStructure="tree"
                        keyExpr={'opcion_menu_id'}
                        selectionMode={'single'}
                        focusStateEnabled={false}
                        expandEvent={'click'}
                        onItemClick={selectedItemChanged}
                        onContentReady={onMenuReady}
                        width={'100%'}
                        searchEnabled={false}
                        hasItemsExpr={'hasItems'}
                        itemsExpr={'items'}
                    />
                )}
            </div>
        </div>
    )
}
