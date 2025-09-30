/* eslint-disable no-prototype-builtins */
import CustomStore from 'devextreme/data/custom_store'
import { DataService, ScpGridConfig } from '../../shared/interfaces'
import { useAuthStore } from '../../auth'
import { Configuration } from '../interfaces'

export const useConfigurationDataGridConfig = (configurationsService: DataService<Configuration>) => {
    const userInfo = useAuthStore((state) => state.userInfo)

    const obtenerConfig = async (dataSource: CustomStore): Promise<ScpGridConfig> => {
        const config: ScpGridConfig = {
            dataSource: dataSource,
            dataId: 'configuration_id',
            columns: [
                {
                    dataField: 'configuration_cd',
                    caption: 'Código de la configuración',
                    allowFiltering: true,
                    validationRules: [
                        {
                            type: 'required',
                            message: 'El campo es requerido',
                        },
                        {
                            type: 'stringLength',
                            min: 1,
                            max: 25,
                            message: 'El campo debe tener entre 1 y 25 caracteres',
                        },
                    ],
                },
                {
                    dataField: 'configuration',
                    caption: 'Configuración',
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
                    dataField: 'value',
                    caption: 'Valor',
                    allowFiltering: true,
                    validationRules: [
                        {
                            type: 'required',
                            message: 'El campo es requerido',
                        },
                        {
                            type: 'stringLength',
                            min: 1,
                            max: 500,
                            message: 'El campo debe tener entre 1 y 500 caracteres',
                        },
                    ],
                },
                {
                    dataField: 'configuration_cd',
                    caption: 'Código de la configuración',
                    allowFiltering: true,
                    validationRules: [
                        {
                            type: 'required',
                            message: 'El campo es requerido',
                        },
                        {
                            type: 'stringLength',
                            min: 1,
                            max: 25,
                            message: 'El campo debe tener entre 1 y 25 caracteres',
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
            allowUpdate: false,
            allowDelete: false,
            allowCreate: false,
            allowExportPDF: true,
            fileName: 'Configuraciones',
            allowExportExcel: true,
            remoteOperations: { grouping: false, filtering: true, paging: true },
            deferredLoading: true,
            buttonsInLastColumn: true,
            margin: 'mx-3',
            editMode: 'row',
        }
        const modelProperties = await configurationsService.getModelProperties()
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
