import { serverAPI } from '../../api/server.api'
import { NavigationItem } from '../interfaces/navigation-item.interface'

const URL_BASE: string = '/menu_option'

const getNestedMenuOptions = async (): Promise<NavigationItem[]> => {
    try {
        const { data: apiResponse } = await serverAPI.get(`${URL_BASE}/getNestedMenuOptions`)
        return apiResponse.data
    } catch (error: any) {
        throw new Error(error.message)
    }
}

export { getNestedMenuOptions }
