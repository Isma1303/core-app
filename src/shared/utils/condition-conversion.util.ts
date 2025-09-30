/* eslint-disable indent */
import { Condition } from '../interfaces'

const convertFiltersToConditions = (filters: any): Condition[] => {
    const conditions: Condition[] = []
    if (typeof filters[0] === 'string') {
        const { operator, value } = assignOperator(filters[1], filters[2] || filters.filterValue)
        const field = filters[0]
        conditions.push({ field, value, operator })
    } else {
        filters.forEach((filter: string | string[]) => {
            if (typeof filter !== 'string') {
                const { operator, value } = assignOperator(filter[1], filter[2])
                const field = filter[0]
                conditions.push({ field, value, operator })
            }
        })
    }
    return conditions
}

const assignOperator = (operator: string, value: string) => {
    switch (operator) {
        case 'startswith':
            operator = 'LIKE'
            value = `${value}%`
            break
        case 'endswith':
            operator = 'LIKE'
            value = `%${value}`
            break
        case 'contains':
            operator = 'LIKE'
            value = `%${value}%`
            break
        case 'notcontains':
            operator = 'NOT LIKE'
            value = `%${value}%`
            break
    }
    return { operator, value }
}

export { convertFiltersToConditions }
