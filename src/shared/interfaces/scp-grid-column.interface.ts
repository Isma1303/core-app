import { ReactNode } from 'react'

export interface ScpGridLookup {
    dataSource?: Record<string, any>[] | (() => Promise<any[]>) | any
    valueExpr?: string
    displayExpr?: string
}

export interface ScpGridValidationRule {
    type: string
    message?: string
    min?: number
    max?: number
}

export interface ScpGridColumn {
    dataField: string
    caption?: string
    dataType?: 'string' | 'number' | 'boolean' | 'date'
    allowFiltering?: boolean
    allowEditing?: boolean
    lookup?: ScpGridLookup
    validationRules?: ScpGridValidationRule[]
    cellTemplate?: (row: Record<string, any>) => ReactNode
}
