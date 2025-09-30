import CustomStore from 'devextreme/data/custom_store'
import { DataService } from '../interfaces/data-service.interface'
import { convertFiltersToConditions } from '../utils/condition-conversion.util'
import { Condition, IOptionsCustomStore } from '../interfaces'
import { byKeyFunctionConcat, loadFunction, loadFunctionConcat } from '../utils'

/**
 * Creates a CustomStore for SelectBox components that need to concatenate two fields, displaying them as a single value and enabling search.
 * @param service The service used for performing the queries
 * @param tableKey Name of the table's key
 * @returns CustomStore
 */
const customStoreBuilder = <T>(service: DataService<T>, tableKey: string, otherOptions?: IOptionsCustomStore): CustomStore => {
    return new CustomStore({
        key: tableKey,
        load: async (loadOptions) => {
            const conditions: Condition[] = []
            if (otherOptions?.initialFilters) {
                conditions.push(...otherOptions.initialFilters)
            }
            if (loadOptions.filter) {
                conditions.push(...convertFiltersToConditions(loadOptions.filter))
            }
            let totalRecords = -1
            if (conditions.length > 0) {
                if (loadOptions.requireTotalCount) {
                    totalRecords = await service.getAffectedRecordsByQuery(conditions)
                }
                let data = await service.search(
                    conditions,
                    loadOptions.skip || 0,
                    loadOptions.take || totalRecords,
                    otherOptions?.orderBy?.field,
                    otherOptions?.orderBy?.direction
                )
                if (otherOptions?.transformAfterGetData) {
                    data = otherOptions.transformAfterGetData(data)
                }
                return new Promise((resolve) => {
                    resolve({ data, totalCount: totalRecords === -1 ? data?.length || 0 : totalRecords })
                })
            }
            if (loadOptions.requireTotalCount) {
                totalRecords = await service.getTotalRecords()
            }
            let data = await service.getRecords(
                loadOptions.skip || 0,
                loadOptions.take || totalRecords,
                otherOptions?.orderBy?.field,
                otherOptions?.orderBy?.direction
            )
            if (otherOptions?.transformAfterGetData) {
                data = otherOptions.transformAfterGetData(data)
            }
            return new Promise((resolve) => {
                resolve({ data, totalCount: totalRecords === -1 ? data?.length || 0 : totalRecords })
            })
        },
        insert: (values: T | never[]) => {
            if (otherOptions?.transformInsertData) {
                values = otherOptions.transformInsertData<T>(values as T)
            }
            if (otherOptions?.validateBeforeInsert && !otherOptions.validateBeforeInsert(values)) {
                return Promise.reject(
                    otherOptions.messages?.validateBeforeInsert || otherOptions.messages?.validationError || 'La validación no se ha cumplido'
                )
            }
            if (otherOptions?.defaultInsertValues) {
                otherOptions.defaultInsertValues.forEach((value) => {
                    ;(values as any)[value.key] = value.value
                })
            }
            return service.createRecord(values)
        },
        update: async (key: string | number, values: T | Record<string, any>) => {
            if (otherOptions?.transformUpdateData) {
                values = otherOptions.transformUpdateData<T>(values as Record<string, any>)
            }
            if (otherOptions?.validateBeforeUpdate && !otherOptions.validateBeforeUpdate(key, values)) {
                return Promise.reject(
                    otherOptions.messages?.validateBeforeUpdate || otherOptions.messages?.validationError || 'La validación no se ha cumplido'
                )
            }
            if (otherOptions?.alternativeUpdate) {
                return otherOptions.alternativeUpdate<T>(key, values)
            }
            await service.updateRecord(key, values)
        },
        remove: async (key: string | number) => {
            if (otherOptions?.validateBeforeDelete && !otherOptions.validateBeforeDelete(key)) {
                return Promise.reject(
                    otherOptions.messages?.validateBeforeDelete || otherOptions.messages?.validationError || 'La validación no se ha cumplido'
                )
            }
            if (otherOptions?.alternativeDelete) {
                return otherOptions.alternativeDelete(key)
            }
            await service.deleteRecord(key)
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        byKey: async (key: string | number, _?: any) => {
            if (key === 0 || key === '') return []
            const result = await service.getRecord(key)
            return result ?? []
        },
    })
}

/**
 * Creates a CustomStore for DataGrid components that require initial conditions.
 * @param service The service used for performing the queries
 * @param tableKey Name of the table's key
 * @returns CustomStore
 */
const customStoreWithInitialConditionsBuilder = <T>(service: DataService<T>, tableKey: string, initialConditions: Condition[]): CustomStore => {
    return new CustomStore({
        key: tableKey,
        load: async (loadOptions) => {
            if (loadOptions.filter || initialConditions.length > 0) {
                const conditions: Condition[] = loadOptions.filter
                    ? [...initialConditions, ...convertFiltersToConditions(loadOptions.filter)]
                    : initialConditions
                const totalRecords = await service.getAffectedRecordsByQuery(conditions)
                const data = service.search(conditions, loadOptions.skip || 0, loadOptions.take || totalRecords)
                return new Promise((resolve) => {
                    resolve({ data, totalCount: totalRecords })
                })
            } else {
                const totalRecords = await service.getTotalRecords()
                const data = await service.getRecords(loadOptions.skip || 0, loadOptions.take || totalRecords)
                return new Promise((resolve) => {
                    resolve({ data, totalCount: totalRecords })
                })
            }
        },
        insert: (values: T | never[]) => service.createRecord(values),
        update: (key: string | number, values: T | Record<string, any>) => service.updateRecord(key, values),
        remove: async (key: string | number) => service.deleteRecord(key),
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        byKey: async (key: string | number, _?: any): Promise<any> => {
            if (key === 0 || key === '') return []
            return service.getRecord(key)
        },
    })
}

/**
 * Creates a CustomStore for SelectBox components.
 * @param service The service used for performing the queries
 * @param tableKey Name of the table's key
 * @returns CustomStore
 */
const customStoreReadOnlyBuilder = <T>(service: DataService<T>, tableKey: string): CustomStore => {
    return new CustomStore({
        key: tableKey,
        load: async (loadOptions) => {
            service.getTotalRecords = service.getTotalRecords.bind(service)
            service.getRecords = service.getRecords.bind(service)
            service.search = service.search.bind(service)
            return loadFunction<T>(service.getTotalRecords, service.getRecords, loadOptions, service.search)
        },
        byKey: async (key: string | number) => {
            if (key === 0) return []
            return service.getRecord(key).catch(() => {
                return []
            })
        },
    })
}

/**
 * Creates a CustomStore for SelectBox components that need to concatenate two fields, displaying them as a single value and enabling search.
 * @param service The service used for performing the queries
 * @param tableKey Name of the table's key
 * @param fieldToDisplay Field to be displayed and concatenated with another
 * @param fieldToConcatenate Field to be appended to the fieldToDisplay
 * @returns CustomStore
 */
const customStoreReadOnlyConcat = <T>(service: DataService<T>, tableKey: string, fieldToDisplay: string, fieldToConcatenate: string): CustomStore => {
    return new CustomStore({
        key: tableKey,
        load: async (loadOptions) => {
            service.getTotalRecords = service.getTotalRecords.bind(service)
            service.getRecords = service.getRecords.bind(service)
            service.search = service.search.bind(service)
            return loadFunctionConcat<T>(service.getTotalRecords, service.getRecords, loadOptions, service.search, fieldToDisplay, fieldToConcatenate)
        },
        byKey: (key: string | number) => {
            service.search = service.search.bind(service)
            return byKeyFunctionConcat<T>(service.search, key, tableKey, fieldToDisplay, fieldToConcatenate)
        },
    })
}

export { customStoreBuilder, customStoreWithInitialConditionsBuilder, customStoreReadOnlyBuilder, customStoreReadOnlyConcat }
