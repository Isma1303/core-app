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
        <>
            <h2 className="content-block">Configuraciones</h2>
            {configurationsConfiguration && <ScpGrid configuration={configurationsConfiguration!} />}
        </>
    )
}
