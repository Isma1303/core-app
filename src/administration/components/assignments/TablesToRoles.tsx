import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScpGrid } from '@/shared/components'
import { customStoreBuilder } from '@/shared/builders/custom-store-builder.builder'
import { ScpGridConfig } from '@/shared/interfaces/scp-grid-config.interface'
import { Role, Table, TableToRole } from '../../interfaces'
import { RoleService, TablesService, TablesToRolesService } from '../../services'

const tableService = new TablesService()
const rolesService = new RoleService()
const tableToRolesService = new TablesToRolesService()

export const TablesToRoles = (): JSX.Element => {
    const [tables, setTables] = useState<Table[]>([])
    const [roles, setRoles] = useState<Role[]>([])
    const [configuration, setConfiguration] = useState<ScpGridConfig | null>(null)

    useEffect(() => {
        const loadLookupData = async () => {
            const [tablesTotal, rolesTotal] = await Promise.all([tableService.getTotalRecords(), rolesService.getTotalRecords()])
            const [tablesData, rolesData] = await Promise.all([
                tablesTotal > 0 ? tableService.getRecords(0, tablesTotal).catch(() => []) : Promise.resolve([]),
                rolesTotal > 0 ? rolesService.getRecords(0, rolesTotal).catch(() => []) : Promise.resolve([]),
            ])

            setTables(tablesData)
            setRoles(rolesData)
        }

        loadLookupData().catch((error) => {
            console.error('Error loading table assignment lookups:', error)
            setTables([])
            setRoles([])
        })
    }, [])

    useEffect(() => {
        const config: ScpGridConfig = {
            dataSource: customStoreBuilder<TableToRole>(tableToRolesService, 'record_id'),
            dataId: 'record_id',
            columns: [
                {
                    dataField: 'role_id',
                    caption: 'Rol',
                    allowFiltering: true,
                    validationRules: [
                        {
                            type: 'required',
                            message: 'El rol es requerido',
                        },
                    ],
                    lookup: {
                        dataSource: roles,
                        valueExpr: 'role_id',
                        displayExpr: 'role',
                    },
                },
                {
                    dataField: 'table_id',
                    caption: 'Tabla',
                    allowFiltering: true,
                    validationRules: [
                        {
                            type: 'required',
                            message: 'La tabla es requerida',
                        },
                    ],
                    lookup: {
                        dataSource: tables,
                        valueExpr: 'table_id',
                        displayExpr: 'table_name',
                    },
                },
                {
                    dataField: 'field',
                    caption: 'Campo',
                    allowFiltering: true,
                    validationRules: [
                        {
                            type: 'required',
                            message: 'El campo es requerido',
                        },
                    ],
                },
            ],
            showBorders: true,
            showSearch: true,
            showFilters: true,
            allowReordering: true,
            allowColumnSelection: true,
            pageRecords: [5, 10, 20],
            allowUpdate: true,
            allowDelete: true,
            allowCreate: true,
            allowExportPDF: false,
            allowExportExcel: false,
            buttonsInLastColumn: true,
            margin: '1',
            editMode: 'row',
            fileName: 'Asignacion de Registros',
        }

        setConfiguration(config)
    }, [roles, tables])

    return (
        <div className="space-y-4">
            <Card className="border-border/50 shadow-sm transition-all hover:shadow-md animate-in fade-in duration-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg font-bold">Asignación de Registros</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Administra los registros asignados a cada rol y tabla. Los catálogos de roles y tablas se resuelven como nombres legibles.
                    </p>
                </CardContent>
            </Card>

            {configuration && <ScpGrid configuration={configuration} />}
        </div>
    )
}
