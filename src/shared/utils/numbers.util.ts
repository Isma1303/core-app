export const getNumberWithNDecimals = <T extends string | number>(number: number, options?: { decimals?: number }): T => {
    const { decimals = 8 } = options || {}
    const [integer, decimal = ''] = number.toString().split('.')
    const result = [integer, decimal.slice(0, decimals)].join('.')

    if ((typeof '0' as T) === 'number') {
        return Number(result).toFixed(decimals) as T
    }
    return result as T
}
