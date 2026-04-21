import { useEffect, useState } from 'react'
import { useMenuOptionsDataGridConfig } from '../hooks'
import { MenuOption } from '../interfaces'
import { MenuOptionsService } from '../services'
import { ScpGrid } from '../../shared/components'
import { ScpGridConfig } from '@/shared/interfaces/scp-grid-config.interface'
import { customStoreBuilder } from '@/shared/builders/custom-store-builder.builder'

export const MenuOptions = (): JSX.Element => {
    const menuOptionsService = new MenuOptionsService()

    const { obtenerConfig } = useMenuOptionsDataGridConfig(menuOptionsService)

    const menuOptionsCustomStore = customStoreBuilder<MenuOption>(menuOptionsService, 'menu_option_id')
    const [menuOptionsConfiguration, setMenuOptionsConfiguration] = useState<ScpGridConfig | null>(null)

    useEffect(() => {
        obtenerConfig(menuOptionsCustomStore).then((config) => {
            setMenuOptionsConfiguration(config)
        })
    }, [])

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Opciones de Menú</h2>
                    <p className="text-muted-foreground text-sm">Gestiona la estructura y visibilidad del menú de navegación.</p>
                </div>
            </div>

            <div className="px-4 pb-8">
                {menuOptionsConfiguration && <ScpGrid configuration={menuOptionsConfiguration!} />}
            </div>
        </div>
    )
}
