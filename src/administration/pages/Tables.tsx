import { useEffect, useState } from 'react'
import { TablesService } from '../services'
import { ScpGridConfig } from '../../shared/interfaces'
import { ScpGrid } from '../../shared/components'
import { Table } from '../interfaces'
import { customStoreBuilder } from '../../shared/builders/custom-store-builder.builder'
import { useTablesDataGridConfig } from '../hooks'

export const Tables = (): JSX.Element => {
    const tablesService = new TablesService()

    const { obtenerConfig } = useTablesDataGridConfig(tablesService)

    const tablesCustomStore = customStoreBuilder<Table>(tablesService, 'table_id')
    const [tablesConfiguration, setTablesConfiguration] = useState<ScpGridConfig | null>(null)

    useEffect(() => {
        obtenerConfig(tablesCustomStore).then((config) => {
            setTablesConfiguration(config)
        })
    }, [])

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Tablas</h2>
                    <p className="text-muted-foreground text-sm">Configura y visualiza las tablas del sistema y su metadata.</p>
                </div>
            </div>

            <div className="px-4 pb-8">
                {tablesConfiguration && <ScpGrid configuration={tablesConfiguration!} />}
            </div>
        </div>
    )
}
