export interface Field {
    name: string
    description: string
    required: boolean
    alias?: string
    unique?: boolean
    dataType?: 'string' | 'number' | 'boolean' | 'date' | 'object'
    maxLength?: number
    minLength?: number
    maxValue?: number
    minValue?: number
    regExp?: string
    validateFn?: any
    validationCriteria?: string
    expectedValue?: string
    sourceTable?: string
}

export interface ModelProperties {
    tableName: string
    tableKey: string
    tableFields: Field[]
    fieldsName: string[]
}
