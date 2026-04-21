import { useEffect, useState } from 'react'
import { customStoreBuilder } from '../../shared/builders/custom-store-builder.builder'
import { useConfigurationDataGridConfig } from '../hooks'
import { Configuration } from '../interfaces'
import { ConfigurationsService } from '../services'
import { ScpGridConfig } from '../../shared/interfaces'
import { ScpGrid } from '../../shared/components'

export const Configurations = () => {
    const configurationsService = new ConfigurationsService()

    const { obtenerConfig } = useConfigurationDataGridConfig(configurationsService)

    const tablesCustomStore = customStoreBuilder<Configuration>(configurationsService, 'configuration_id')
    const [configurationsConfiguration, setConfigurationsConfiguration] = useState<ScpGridConfig | null>(null)

    useEffect(() => {
        obtenerConfig(tablesCustomStore).then((config) => {
            setConfigurationsConfiguration(config)
        })
    }, [])

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Configuraciones</h2>
                    <p className="text-muted-foreground text-sm">Gestiona las variables y parámetros globales del sistema.</p>
                </div>
            </div>

            <div className="px-4 pb-8">
                {configurationsConfiguration && <ScpGrid configuration={configurationsConfiguration!} />}
            </div>
        </div>
    )
}
