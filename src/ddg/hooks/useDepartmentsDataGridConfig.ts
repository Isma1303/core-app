import { useAuthStore } from '@/auth'
import { DataService, ScpGridConfig } from '@/shared/interfaces'
import { IDepartments } from '../interfaces/departments.interface'

export const useDepartmentsDataGridConfig = (service: DataService<IDepartments>) => {
    const userInfo = useAuthStore((state) => state.userInfo)

    const obtenerConfig = async (dataSource: any): Promise<any> => {
        const modelProperties = await service.getModelProperties()
        const table = modelProperties?.tableName.toUpperCase()
        const config: ScpGridConfig = {
            dataSource: dataSource,
            dataId: 'department_id',
            columns: [
                {
                    dataField: 'department_nm',
                    caption: 'Ministerio',
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
            fileName: 'Ministerios',
            allowExportExcel: true,
            remoteOperations: { grouping: false, filtering: true, paging: true },
            deferredLoading: false,
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
            config.buttonsInLastColumn = true
            return config
        }
        return config
    }

    return {
        obtenerConfig,
    }
}
