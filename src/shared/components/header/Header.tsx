import type { HeaderProps } from '../../../types'
import { UserPanel } from '../../../auth'
import './Header.scss'

export const Header = ({ menuToggleEnabled, title, toggleMenu, image }: HeaderProps): JSX.Element => {
    return (
        <header className={'header-component'}>
            <div className={'header-toolbar'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
                <div className={'menu-button'}>
                    {menuToggleEnabled && (
                        <button onClick={toggleMenu} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            Menu
                        </button>
                    )}
                </div>
                {image && (
                    <div className={'header-title'}>
                        {/* <img className="img-fluid mt-2 mb-2" src={`./assets/${image}`} style={{ height: '5vh' }} /> */}
                    </div>
                )}
                {title && <div className={'header-title'}>{title}</div>}
                <div className={'user-button-container'}>
                    <div className={'user-button authorization'}>
                        <UserPanel menuMode={'context'} />
                    </div>
                </div>
            </div>
        </header>
    )
}
