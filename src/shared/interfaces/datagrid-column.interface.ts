import { ReactNode } from 'react'

export interface DataGridLookup {
    dataSource?: Record<string, any>[] | (() => Promise<any[]>) | any
    valueExpr?: string
    displayExpr?: string
}

export interface DataGridValidationRule {
    type: string
    message?: string
    min?: number
    max?: number
}

export interface DataGridColumn {
    dataField: string
    caption?: string
    dataType?: 'string' | 'number' | 'boolean' | 'date'
    allowFiltering?: boolean
    allowEditing?: boolean
    lookup?: DataGridLookup
    validationRules?: DataGridValidationRule[]
    cellTemplate?: (row: Record<string, any>) => ReactNode
}