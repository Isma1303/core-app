import { useEffect, useState } from 'react'
import { customStoreBuilder } from '../../shared/builders/custom-store-builder.builder'
import { useMenuOptionsDataGridConfig } from '../hooks'
import { MenuOption } from '../interfaces'
import { MenuOptionsService } from '../services'
import { ScpGridConfig } from '../../shared/interfaces'
import { ScpGrid } from '../../shared/components'

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
