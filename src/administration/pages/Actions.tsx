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
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Acciones</h2>
                    <p className="text-muted-foreground text-sm">Define las acciones atómicas que los usuarios pueden ejecutar.</p>
                </div>
            </div>

            <div className="px-4 pb-8">
                {actionsConfiguration && <ScpGrid configuration={actionsConfiguration!} />}
            </div>
        </div>
    )
}
