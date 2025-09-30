import Drawer from 'devextreme-react/drawer'
import ScrollView from 'devextreme-react/scroll-view'
import React, { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Header, SideNavigationMenu, Footer } from '../../components'
import './side-nav-outer-toolbar.scss'
import { useScreenSize } from '../../utils/media-query'
import { Template } from 'devextreme-react/core/template'
import { useMenuPatch } from '../../utils/patches'

export const SideNavOuterToolbar = ({ title, children }: { title: string; children: JSX.Element[] }): JSX.Element => {
    const scrollViewRef = useRef<any>(null)
    const navigate = useNavigate()
    const { isLarge } = useScreenSize()
    const [onMenuReady] = useMenuPatch()
    const [menuStatus, setMenuStatus] = useState(isLarge ? MenuStatus.Opened : MenuStatus.Closed)

    const toggleMenu = useCallback(({ event }: any) => {
        setMenuStatus((prevMenuStatus) => (prevMenuStatus === MenuStatus.Closed ? MenuStatus.Opened : MenuStatus.Closed))
        event.stopPropagation()
    }, [])

    const temporaryOpenMenu = useCallback(() => {
        setMenuStatus((prevMenuStatus) => (prevMenuStatus === MenuStatus.Closed ? MenuStatus.TemporaryOpened : prevMenuStatus))
    }, [])

    const onNavigationChanged = useCallback(
        ({ itemData, event, node }: any) => {
            if (menuStatus === MenuStatus.Closed || !itemData.path || node.selected) {
                event.preventDefault()
                return
            }

            navigate(itemData.path)

            if (!isLarge || menuStatus === MenuStatus.TemporaryOpened) {
                setMenuStatus(MenuStatus.Closed)
                event.stopPropagation()
            }
        },
        [navigate, menuStatus, isLarge]
    )

    return (
        <div className={'side-nav-outer-toolbar'}>
            <Header menuToggleEnabled toggleMenu={toggleMenu} image="logo_inicio.png" title={title} />
            <Drawer
                className={'layout-body'}
                position={'before'}
                closeOnOutsideClick={false}
                openedStateMode={'shrink'}
                revealMode={'expand'}
                minSize={60}
                shading={false}
                opened={menuStatus === MenuStatus.Closed ? false : true}
                template={'menu'}
            >
                <div className={'container-fluid'}>
                    <ScrollView ref={scrollViewRef} height={'95vh'} className={'layout-body with-footer'}>
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
                    </ScrollView>
                </div>
                <Template name={'menu'}>
                    <SideNavigationMenu
                        compactMode={menuStatus === MenuStatus.Closed}
                        selectedItemChanged={onNavigationChanged}
                        openMenu={temporaryOpenMenu}
                        onMenuReady={onMenuReady}
                    ></SideNavigationMenu>
                </Template>
            </Drawer>
        </div>
    )
}

const MenuStatus = {
    Closed: 1,
    Opened: 2,
    TemporaryOpened: 3,
}
