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
        <>
            <h2 className="content-block">Tablas</h2>
            {tablesConfiguration && <ScpGrid configuration={tablesConfiguration!} />}
        </>
    )
}
