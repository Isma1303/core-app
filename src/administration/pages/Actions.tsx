import { useEffect, useState } from 'react'
import { customStoreBuilder } from '../../shared/builders/custom-store-builder.builder'
import { useActionsDataGridConfig } from '../hooks'
import { Action } from '../interfaces'
import { ActionsService } from '../services/actions.service'
import { ScpGridConfig } from '../../shared/interfaces'
import { ScpGrid } from '../../shared/components'

export const Actions = (): JSX.Element => {
    const actionsService = new ActionsService()

    const { obtenerConfig } = useActionsDataGridConfig(actionsService)

    const actionsCustomStore = customStoreBuilder<Action>(actionsService, 'action_id')
    const [actionsConfiguration, setActionsConfiguration] = useState<ScpGridConfig | null>(null)

    useEffect(() => {
        obtenerConfig(actionsCustomStore).then((config) => {
            setActionsConfiguration(config)
        })
    }, [])

    return (
        <>
            <h2 className="content-block">Acciones</h2>
            {actionsConfiguration && <ScpGrid configuration={actionsConfiguration!} />}
        </>
    )
}
