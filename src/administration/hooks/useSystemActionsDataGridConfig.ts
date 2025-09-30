/* eslint-disable no-prototype-builtins */
import CustomStore from 'devextreme/data/custom_store'
import { DataService, ScpGridConfig } from '../../shared/interfaces'
import { useAuthStore } from '../../auth'
import { SystemAction } from '../interfaces'

export const useSystemActionsDataGridConfig = (systemActionsService: DataService<SystemAction>) => {
    const userInfo = useAuthStore((state) => state.userInfo)

    const obtenerConfig = async (dataSource: CustomStore): Promise<ScpGridConfig> => {
        const config: ScpGridConfig = {
            dataSource: dataSource,
            dataId: 'system_action_id',
            columns: [
                {
                    dataField: 'system_action_name',
                    caption: 'Nombre de la Acción',
                    allowFiltering: true,
                    minWidth: 200,
                    validationRules: [
                        {
                            type: 'required',
                            message: 'El campo es requerido',
                        },
                        {
                            type: 'stringLength',
                            min: 1,
                            max: 100,
                            message: 'El campo debe tener entre 1 y 100 caracteres',
                        },
                    ],
                },
                {
                    dataField: 'component_id',
                    caption: 'Id del Componente (React - API)',
                    allowFiltering: true,
                    minWidth: 200,
                    validationRules: [
                        {
                            type: 'required',
                            message: 'El campo es requerido',
                        },
                        {
                            type: 'stringLength',
                            min: 1,
                            max: 100,
                            message: 'El campo debe tener entre 1 y 100 caracteres',
                        },
                    ],
                },
                {
                    dataField: 'module_name',
                    caption: 'Nombre del módulo',
                    allowFiltering: true,
                    minWidth: 150,
                    validationRules: [
                        {
                            type: 'stringLength',
                            max: 100,
                            message: 'El campo debe tener máximo 100 caracteres',
                        },
                    ],
                },
                {
                    dataField: 'route_path',
                    caption: 'Ruta de acceso',
                    allowFiltering: true,
                    minWidth: 200,
                    validationRules: [
                        {
                            type: 'stringLength',
                            max: 255,
                            message: 'El campo debe tener máximo 255 caracteres',
                        },
                    ],
                },
                {
                    dataField: 'http_method',
                    caption: 'Método HTTP',
                    allowFiltering: true,
                    minWidth: 100,
                    validationRules: [
                        {
                            type: 'stringLength',
                            max: 10,
                            message: 'El campo debe tener máximo 10 caracteres',
                        },
                    ],
                },
                {
                    dataField: 'action_type',
                    caption: 'Tipo de acción/componente',
                    allowFiltering: true,
                    minWidth: 150,
                    validationRules: [
                        {
                            type: 'stringLength',
                            max: 50,
                            message: 'El campo debe tener máximo 50 caracteres',
                        },
                    ],
                },
                {
                    dataField: 'priority',
                    caption: 'Prioridad de acción',
                    allowFiltering: true,
                    dataType: 'number',
                    alignment: 'left',
                    minWidth: 100,
                    validationRules: [
                        {
                            type: 'range',
                            min: 1,
                            max: 5,
                            message: 'El campo debe tener un valor entre 1 y 5',
                        },
                    ],
                },
                {
                    dataField: 'description',
                    caption: 'Descripción',
                    allowFiltering: true,
                    minWidth: 250,
                    validationRules: [
                        {
                            type: 'stringLength',
                            max: 255,
                            message: 'El campo debe tener máximo 255 caracteres',
                        },
                    ],
                },
                {
                    dataField: 'is_active',
                    caption: '¿Está activo?',
                    dataType: 'boolean',
                    allowFiltering: true,
                    default: false,
                    minWidth: 100,
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
            fileName: 'Acciones del Sistema',
            allowExportExcel: true,
            remoteOperations: { grouping: false, filtering: true, paging: true },
            deferredLoading: true,
            buttonsInLastColumn: true,
            margin: 'mx-3',
            editMode: 'row',
        }
        const modelProperties = await systemActionsService.getModelProperties()
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
