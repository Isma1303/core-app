export interface IAsyncRuleCallback {
    column: Record<string, any>
    data: Record<string, any>
    formItem: Record<string, any>
    rule: Record<string, any>
    validator: Record<string, any>
    value: string | number
}
