import { DataService } from '../interfaces'

export interface CustomStoreLoadOptions {
    page?: number
    pageSize?: number
    sortField?: string
    sortDirection?: 'asc' | 'desc'
    searchText?: string
}

export interface CustomStoreLike<T> {
    load: (options?: CustomStoreLoadOptions) => Promise<{ data: T[]; totalCount: number }>
    insert: (values: T | never[]) => Promise<T | never[]>
    update: (key: string | number, values: T | Record<string, any>) => Promise<T[]>
    remove: (key: string | number) => Promise<void>
    keyField: string
}

export const buildCustomStore = <T>(service: DataService<T>, keyField: string): CustomStoreLike<T> => {
    return {
        keyField,
        load: async (options = {}) => {
            const page = options.page ?? 1
            const pageSize = options.pageSize ?? 10
            const offset = (page - 1) * pageSize
            const sortField = options.sortField ?? keyField
            const sortDirection = options.sortDirection ?? 'asc'

            let data = await service.getRecords(offset, pageSize, sortField, sortDirection)
            const totalCount = await service.getTotalRecords()

            if (options.searchText) {
                const term = options.searchText.toLowerCase()
                data = data.filter((row: any) =>
                    Object.values(row).some((value) =>
                        String(value ?? '')
                            .toLowerCase()
                            .includes(term),
                    ),
                )
            }

            return { data, totalCount }
        },
        insert: (values) => service.createRecord(values),
        update: (key, values) => service.updateRecord(key, values),
        remove: (key) => service.deleteRecord(key),
    }
}

export const buildLookupDataSource = <T>(service: DataService<T>) => {
    return () => service.getRecords(0, 1000)
}


export const buildLookpDataSource = buildLookupDataSource


