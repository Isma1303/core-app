import React, { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Header, SideNavigationMenu, Footer } from '../../components'
import './side-nav-outer-toolbar.scss'
import { useScreenSize } from '../../utils/media-query'

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
        setMenuStatus((prevMenuStatus) => (prevMenuStatus === MenuStatus.Closed ? MenuStatus.TemporaryOpened : prevMenuStatus))
    }, [])

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
        [navigate, menuStatus, isLarge]
    )

    const isOpened = menuStatus !== MenuStatus.Closed

    return (
        <div className={'side-nav-outer-toolbar'} style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Header menuToggleEnabled toggleMenu={toggleMenu} image="logo_inicio.png" title={title} />
            <div className={'layout-body'} style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <aside 
                    style={{ 
                        width: isOpened ? '250px' : '60px', 
                        transition: 'width 0.3s', 
                        background: '#f4f4f4',
                        overflowX: 'hidden'
                    }}
                >
                    <SideNavigationMenu
                        compactMode={!isOpened}
                        selectedItemChanged={onNavigationChanged}
                        openMenu={temporaryOpenMenu}
                    />
                </aside>
                <div 
                    className={'container-fluid'} 
                    style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}
                    ref={scrollViewRef}
                >
                    <div className={'content'}>
                        {React.Children.map(children, (item) => {
                            return item.type !== Footer && item
                        })}
                    </div>
                    <div className={'content-block'}>
                        {React.Children.map(children, (item) => {
                            return item.type === Footer && item
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

const MenuStatus = {
    Closed: 1,
    Opened: 2,
    TemporaryOpened: 3,
}
