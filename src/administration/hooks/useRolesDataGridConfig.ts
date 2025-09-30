/* eslint-disable no-prototype-builtins */
import CustomStore from 'devextreme/data/custom_store'
import { DataService, ScpGridConfig } from '../../shared/interfaces'
import { useAuthStore } from '../../auth'
import { Role } from '../interfaces'

export const useRolesDataGridConfig = (rolService: DataService<Role>) => {
    const userInfo = useAuthStore((state) => state.userInfo)

    const obtenerConfig = async (dataSource: CustomStore): Promise<ScpGridConfig> => {
        const config: ScpGridConfig = {
            dataSource: dataSource,
            dataId: 'rol_id',
            columns: [
                {
                    dataField: 'role',
                    caption: 'Rol',
                    allowFiltering: true,
                    validationRules: [
                        {
                            type: 'required',
                            message: 'El campo es requerido',
                        },
                        {
                            type: 'stringLength',
                            min: 1,
                            max: 200,
                            message: 'El campo debe tener entre 1 y 200 caracteres',
                        },
                    ],
                },
                {
                    dataField: 'status',
                    caption: 'Estado',
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
            fileName: 'Roles',
            allowExportExcel: true,
            remoteOperations: { grouping: false, filtering: true, paging: true },
            deferredLoading: true,
            buttonsInLastColumn: true,
            margin: 'mx-3',
            editMode: 'row',
        }
        const modelProperties = await rolService.getModelProperties()
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
