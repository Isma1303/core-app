import { Condition } from './condition.interface'

export interface IDefaultInsertValues {
    key: string
    value: any
}

export interface IOptionsCustomStore {
    initialFilters?: Condition[]
    defaultInsertValues?: IDefaultInsertValues[]
    messages?: {
        validationError?: string
        validateBeforeInsert?: string
        validateBeforeUpdate?: string
        validateBeforeDelete?: string
    }
    orderBy?: {
        field: string
        direction?: 'asc' | 'desc'
    }
    validateBeforeInsert?: (values: any) => boolean
    validateBeforeUpdate?: (key: string | number, values: any) => boolean
    validateBeforeDelete?: (key: string | number) => boolean
    alternativeUpdate?: <T>(key: string | number, values: T | Record<string, any>) => PromiseLike<any>
    alternativeDelete?: (key: string | number) => PromiseLike<any>
    transformUpdateData?: <T>(data: Record<string, any>) => T
    transformInsertData?: <T>(data: T) => T
    transformAfterGetData?: (data: any) => any
}
