import { useEffect, useState } from 'react'
import { customStoreBuilder } from '../../../shared/builders/custom-store-builder.builder'
import { useSystemActionsDataGridConfig } from '../../hooks'
import { SystemAction } from '../../interfaces'
import { SystemActionsService } from '../../services'
import { ScpGridConfig } from '../../../shared/interfaces'
import { ScpGrid } from '../../../shared/components'

const systemActionsService = new SystemActionsService()
export const SystemActionsGrid = (): JSX.Element => {
    const { obtenerConfig } = useSystemActionsDataGridConfig(systemActionsService)

    const systemActionsCustomStore = customStoreBuilder<SystemAction>(systemActionsService, 'system_action_id')
    const [systemActionsConfiguration, setSystemActionsConfiguration] = useState<ScpGridConfig | null>(null)

    useEffect(() => {
        obtenerConfig(systemActionsCustomStore).then((config) => {
            setSystemActionsConfiguration(config)
        })
    }, [])

    return (
        <>
            <h2 className="content-block">Acciones del Sistema</h2>
            {systemActionsConfiguration && <ScpGrid configuration={systemActionsConfiguration!} />}
        </>
    )
}
