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
        <>
            <h2 className="content-block">Opciones de menú</h2>
            {menuOptionsConfiguration && <ScpGrid configuration={menuOptionsConfiguration!} />}
        </>
    )
}
