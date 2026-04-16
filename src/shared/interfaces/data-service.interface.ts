/* eslint-disable no-unused-vars */

import { Condition } from './condition.interface'
import { ModelProperties } from './model-properties.interface'

export interface DataService<T> {
    getAffectedRecordsByQuery: (conditions: Condition[]) => Promise<number>
    search: (conditions: Condition[], offset: number, limit: number, orden?: string, orderDirection?: 'asc' | 'desc') => Promise<T[]>
    getTotalRecords: () => Promise<number>
    getRecords: (offset: number, limit: number, orden?: string, orderDirection?: 'asc' | 'desc') => Promise<T[]>
    createRecord: (data: T | never[]) => Promise<T | never[]>
    updateRecord: (key: string | number, data: T | Record<string, any>) => Promise<T[]>
    deleteRecord: (key: string | number) => Promise<void>
    getRecord: (key: string | number) => Promise<T | null>
    getModelProperties(): Promise<ModelProperties>
    updateRecordByConditions?: (data: T | Record<string, any>, conditions: Condition[]) => Promise<T[]>
}
