import Toolbar, { Item } from 'devextreme-react/toolbar'
import { Template } from 'devextreme-react/core/template'
import Button from 'devextreme-react/button'
import type { HeaderProps } from '../../../types'
import { UserPanel } from '../../../auth'
import './Header.scss'

export const Header = ({ menuToggleEnabled, title, toggleMenu, image }: HeaderProps): JSX.Element => {
    return (
        <header className={'header-component'}>
            <Toolbar className={'header-toolbar'}>
                <Item visible={menuToggleEnabled} location={'before'} widget={'dxButton'} cssClass={'menu-button'}>
                    <Button icon="menu" stylingMode="text" onClick={toggleMenu} />
                </Item>
                <Item location={'before'} cssClass={'header-title'} visible={!!image}>
                    {/* <img className="img-fluid mt-2 mb-2" src={`./assets/${image}`} style={{ height: '5vh' }} /> */}
                </Item>
                <Item location={'before'} cssClass={'header-title'} text={title} visible={!!title} />
                <Item location={'after'} locateInMenu={'auto'} menuItemTemplate={'userPanelTemplate'}>
                    <Button className={'user-button authorization'} width={210} height={'100%'} stylingMode={'text'}>
                        <UserPanel menuMode={'context'} />
                    </Button>
                </Item>
                <Template name={'userPanelTemplate'}>
                    <UserPanel menuMode={'list'} />
                </Template>
            </Toolbar>
        </header>
    )
}
