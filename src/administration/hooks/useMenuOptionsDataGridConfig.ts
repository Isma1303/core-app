/* eslint-disable no-prototype-builtins */
import { DataService, ScpGridConfig } from '../../shared/interfaces'
import { useAuthStore } from '../../auth'
import { MenuOption } from '../interfaces'
import { buildLookupDataSource } from '../../shared/utils/custom-store.util'

export const useMenuOptionsDataGridConfig = (menuOptionsService: DataService<MenuOption>) => {
    const userInfo = useAuthStore((state) => state.userInfo)

    const obtenerConfig = async (dataSource: any): Promise<any> => {
        const modelProperties = await menuOptionsService.getModelProperties()
        const table = modelProperties?.tableName.toUpperCase()

        const config: ScpGridConfig = {
            dataSource: dataSource,
            dataId: 'menu_option_id',
            columns: [
                {
                    dataField: 'menu_option',
                    caption: 'Opción de menú',
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
                    dataField: 'parent_menu_option_id',
                    caption: 'Opción de menú padre',
                    allowFiltering: true,
                    lookup: {
                        dataSource: buildLookupDataSource(menuOptionsService),
                        valueExpr: 'menu_option_id',
                        displayExpr: 'menu_option',
                    },
                },
                {
                    dataField: 'icon',
                    caption: 'Icono',
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
                    dataField: 'path',
                    caption: 'Ruta',
                    allowFiltering: true,
                },
                {
                    dataField: 'sort',
                    caption: 'Orden en la barra lateral',
                    allowFiltering: true,
                    validationRules: [
                        {
                            type: 'required',
                            message: 'El campo es requerido',
                        },
                        {
                            type: 'stringLength',
                            min: 1,
                            max: 4,
                            message: 'El campo debe tener entre 1 y 4 caracteres',
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
            fileName: 'Opciones de Menú',
            allowExportExcel: true,
            remoteOperations: { grouping: false, filtering: true, paging: true },
            deferredLoading: true,
            buttonsInLastColumn: true,
            margin: 'mx-3',
            editMode: 'row',
        }

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
