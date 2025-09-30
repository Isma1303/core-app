/* eslint-disable no-prototype-builtins */
import CustomStore from 'devextreme/data/custom_store'
import { DataService, ScpGridConfig } from '../../shared/interfaces'
import { useAuthStore } from '../../auth'
import { Action, Table } from '../interfaces'
import { TablesService } from '../services'
import { customStoreReadOnlyBuilder } from '../../shared/builders/custom-store-builder.builder'

const tablesService = new TablesService()
const tablesCustomStore = customStoreReadOnlyBuilder<Table>(tablesService, 'table_id')

export const useActionsDataGridConfig = (actionsService: DataService<Action>) => {
    const userInfo = useAuthStore((state) => state.userInfo)

    const obtenerConfig = async (dataSource: CustomStore): Promise<ScpGridConfig> => {
        const config: ScpGridConfig = {
            dataSource: dataSource,
            dataId: 'action_id',
            columns: [
                {
                    dataField: 'action',
                    caption: 'Acción',
                    allowFiltering: true,
                    validationRules: [
                        {
                            type: 'required',
                            message: 'El campo es requerido',
                        },
                        {
                            type: 'stringLength',
                            min: 1,
                            max: 75,
                            message: 'El campo debe tener entre 1 y 75 caracteres',
                        },
                    ],
                },
                {
                    dataField: 'table_id',
                    caption: 'Tabla',
                    allowFiltering: true,
                    validationRules: [
                        {
                            type: 'required',
                            message: 'El campo es requerido',
                        },
                    ],
                    lookup: {
                        dataSource: tablesCustomStore,
                        valueExpr: 'table_id',
                        displayExpr: 'table_name',
                    },
                },
                {
                    dataField: 'write_permission',
                    caption: '¿Permite escritura de datos?',
                    dataType: 'boolean',
                    allowFiltering: true,
                },
            ],
            showBorders: true,
            showSearch: true,
            showFilters: true,
            allowReordering: true,
            allowColumnSelection: true,
            pageRecords: [5, 10, 20],
            allowUpdate: false,
            allowDelete: false,
            allowCreate: false,
            allowExportPDF: true,
            fileName: 'Acciones',
            allowExportExcel: true,
            remoteOperations: { grouping: false, filtering: true, paging: true },
            deferredLoading: true,
            buttonsInLastColumn: true,
            margin: 'mx-3',
            editMode: 'row',
        }
        const modelProperties = await actionsService.getModelProperties()
        const table = modelProperties?.tableName.toUpperCase()

        if (!userInfo?.actions.hasOwnProperty(table!)) {
            config.dataSource = []
            return config
        }

        if (userInfo.actions[table!]) {
            config.allowUpdate = true
            config.allowDelete = true
            config.allowCreate = true
            config.buttonsInLastColumn = false
            return config
        }
        return config
    }

    return {
        obtenerConfig,
    }
}
