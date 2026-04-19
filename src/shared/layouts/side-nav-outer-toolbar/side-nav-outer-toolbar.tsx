import React, { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Header, SideNavigationMenu, Footer } from '../../components'
import './side-nav-outer-toolbar.scss'
import { useScreenSize } from '../../utils/media-query'
import { cn } from '@/lib/utils'

export const SideNavOuterToolbar = ({ title, children }: { title: string; children: JSX.Element[] }): JSX.Element => {
    const scrollViewRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const { isLarge } = useScreenSize()
    const [menuStatus, setMenuStatus] = useState(isLarge ? MenuStatus.Opened : MenuStatus.Closed)

    const toggleMenu = useCallback((e: any) => {
        setMenuStatus((prevMenuStatus) => (prevMenuStatus === MenuStatus.Closed ? MenuStatus.Opened : MenuStatus.Closed))
        if (e.event) e.event.stopPropagation()
    }, [])

    const temporaryOpenMenu = useCallback(() => {
        if (menuStatus === MenuStatus.Closed) {
            setMenuStatus(MenuStatus.TemporaryOpened)
        }
    }, [menuStatus])

    const onNavigationChanged = useCallback(
        ({ itemData, event }: any) => {
            if (menuStatus === MenuStatus.Closed || !itemData.path) {
                if (event) event.preventDefault()
                return
            }

            navigate(itemData.path)

            if (!isLarge || menuStatus === MenuStatus.TemporaryOpened) {
                setMenuStatus(MenuStatus.Closed)
                if (event) event.stopPropagation()
            }
        },
        [navigate, menuStatus, isLarge],
    )

    const isOpened = menuStatus !== MenuStatus.Closed

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <Header menuToggleEnabled toggleMenu={toggleMenu} image="logo_inicio.png" title={title} />

            <div className="flex flex-1 overflow-hidden">
                <aside className={cn('z-30 transition-all duration-300 ease-in-out', isOpened ? 'w-60' : 'w-16')}>
                    <SideNavigationMenu compactMode={!isOpened} selectedItemChanged={onNavigationChanged} openMenu={temporaryOpenMenu} />
                </aside>

                <main className="flex-1 overflow-y-auto" ref={scrollViewRef}>
                    <div className="mx-auto max-w-6xl space-y-5 p-5">
                        <div className="content">
                            {React.Children.map(children, (item) => {
                                return item.type !== Footer && item
                            })}
                        </div>
                        <div className="py-6">
                            {React.Children.map(children, (item) => {
                                return item.type === Footer && item
                            })}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

const MenuStatus = {
    Closed: 1,
    Opened: 2,
    TemporaryOpened: 3,
}
