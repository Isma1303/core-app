/* eslint-disable no-unused-vars */
import { LoadOptions } from 'devextreme/data'
import { Condition } from '../interfaces'

const mapOperatorDevExtremeToSQL = new Map<string, string>([
    ['like', 'like'],
    ['contains', 'like'],
    ['=', '='],
])

/**
 * NOT LAZY LOADING! Function that allows data retrieval from a service, a helper for the CustomStore's load function.
 * @param totalRecordsFn Function to retrieve the total number of records in the table
 * @param getFn Function to fetch records from a table
 * @param loadOptions Load options provided by the CustomStore
 * @param searchFn Function to fetch records based on a query
 * @returns CustomStore
 */

const loadFunction = async <T>(
    totalRecordsFn: () => Promise<number>,
    getFn: (offset: number, limit: number, orden?: string) => Promise<T[]>,
    loadOptions: LoadOptions<any>,
    searchFn: (conditions: Condition[], offset: number, limit: number, orden?: string) => Promise<T[]>
) => {
    if (loadOptions.searchValue == null) {
        // Se elimino el uso de totalRecordsFn, ya que no es necesario porque en todo caso se necesita obtener todos los registros
        // const totalRecords = await totalRecordsFn()
        return await getFn(0, -1)
            .then((res: any) => res)
            .catch(() => [])
    }
    const condiciones: Condition[] = [
        {
            field: loadOptions.searchExpr?.toString() || '',
            operator: mapOperatorDevExtremeToSQL.get(loadOptions.searchOperation || 'like') || 'like',
            value: loadOptions.searchOperation === '=' ? loadOptions.searchValue : `%${loadOptions.searchValue}%`,
        },
    ]
    if (typeof searchFn === 'undefined') return []
    return await searchFn(condiciones, loadOptions.skip || 0, loadOptions.take || -1)
        .then((res: any) => res)
        .catch(() => [])
}

/**
 * Function that enables key-based search from a service, a helper for the CustomStore's byKey function.
 * @param byKeyFn Function to fetch a record by an ID or numeric key (usually the table's primary key)
 * @param key Key to execute the search on
 * @returns CustomStore
 */

const byKeyFunction = <T>(byKeyFn: (key: string | number) => Promise<T>, key: number) => byKeyFn(key).catch(() => [])

/**
 * NOT LAZY LOADING! Function that enables data retrieval from a service, a helper for the CustomStore's load function when concatenating two fields is required.
 * @param totalRecordsFn Function to retrieve the total number of records in the table
 * @param getFn Function to fetch records from a table
 * @param loadOptions Load options provided by the CustomStore
 * @param searchFn Function to fetch records based on a query
 * @param displayExpr Name of the field to be displayed and concatenated with another
 * @param concatProp Name of the field to concatenate with displayExpr
 * @returns CustomStore
 */
const loadFunctionConcat = async <T>(
    totalRecordsFn: () => Promise<number>,
    getFn: (offset: number, limit: number, orden?: string) => Promise<T[]>,
    loadOptions: LoadOptions<any>,
    searchFn: (conditions: Condition[], offset: number, limit: number, orden?: string) => Promise<T[]>,
    displayExpr: string,
    concatProp: string
) => {
    if (loadOptions.searchValue == null) {
        const totalRecords = await totalRecordsFn()
        return await getFn(0, totalRecords)
            .then((res) =>
                res.map((record: any) => {
                    record[displayExpr] = `${record[displayExpr]} - ${record[concatProp]}`
                    return record
                })
            )
            .catch(() => [])
    }
    const condiciones: Condition[] = [
        {
            field: loadOptions.searchExpr?.toString() || '',
            operator: 'like',
            value: `%${loadOptions.searchValue}%`,
        },
        {
            field: concatProp,
            operator: 'orLike',
            value: `%${loadOptions.searchValue}%`,
        },
    ]

    if (typeof searchFn === 'undefined') return []
    return searchFn(condiciones, loadOptions.skip || 0, loadOptions.take || 10)
        .then((res) =>
            res.map((record: any) => {
                record[displayExpr] = `${record[displayExpr]} - ${record[concatProp]}`
                return record
            })
        )
        .catch(() => [])
}

/**
 * Function that enables key-based search from a service and concatenates two specified fields, a helper for the CustomStore's byKey function.
 * @param searchFn Function to fetch a record by an ID or numeric key (usually the table's primary key)
 * @param key Key to execute the search on
 * @param keyNm Name of the key to execute the search on
 * @param displayExpr Name of the field to be displayed and concatenated with another
 * @param concatProp Name of the field to concatenate with displayExpr
 * @returns CustomStore
 */
const byKeyFunctionConcat = async <T>(
    searchFn: (conditions: Condition[], offset: number, limit: number, orden?: string) => Promise<T[]>,
    key: string | number,
    keyNm: string,
    displayExpr: string,
    concatProp: string
) => {
    const condiciones: Condition[] = [
        {
            field: keyNm,
            value: key,
        },
    ]

    return searchFn(condiciones, 0, 10)
        .then((res) =>
            res.map((record: any) => {
                record[displayExpr] = `${record[displayExpr]} - ${record[concatProp]}`
                return record
            })
        )
        .catch(() => [])
}

export { loadFunction, byKeyFunction, loadFunctionConcat, byKeyFunctionConcat }
