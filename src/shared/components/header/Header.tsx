import { Menu, LogOut, User as UserIcon } from 'lucide-react'
import type { HeaderProps } from '../../../types'
import { UserPanel } from '../../../auth'
import './Header.scss'

export const Header = ({ menuToggleEnabled, title, toggleMenu, image }: HeaderProps): JSX.Element => {
    return (
        <header className="flex items-center w-full h-16 px-4 border-b bg-background/80 backdrop-blur-md border-border">
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    {menuToggleEnabled && (
                        <button 
                            onClick={toggleMenu} 
                            className="p-2 transition-colors rounded-md hover:bg-accent text-accent-foreground"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    )}
                    
                    {image && (
                        <div className="flex items-center overflow-hidden">
                             <img className="h-8 w-auto object-contain" src={`./assets/${image}`} alt="Logo" />
                        </div>
                    )}
                    
                    {title && (
                        <h1 className="hidden sm:block text-lg font-semibold tracking-tight">
                            {title}
                        </h1>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <UserPanel menuMode={'context'} />
                </div>
            </div>
        </header>
    )
}
