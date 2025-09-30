import { serverAPI } from '../../api/server.api'
import { Condition, DataService, ModelProperties } from '../../shared/interfaces'
import { MenuOption } from '../interfaces'

export class MenuOptionsService implements DataService<MenuOption> {
    private readonly URL_BASE: string = '/menu_option'

    public async getRecord(key: string | number): Promise<MenuOption> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/${key}`)
            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getRecords(offset: number, limit: number, orden?: string): Promise<MenuOption[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(this.URL_BASE, {
                headers: { offset, limit, orden },
            })

            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getTotalRecords(): Promise<number> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/getTotalRecords`)

            return apiResponse.data.totalRecords
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async createRecord(data: MenuOption | never[]): Promise<MenuOption | never[]> {
        try {
            const response = await serverAPI.post(`${this.URL_BASE}`, data)

            return response.data.data
        } catch (error: any) {
            if (error.response?.status === 404) {
                return []
            }
            throw new Error(error.message)
        }
    }

    public async deleteRecord(key: string | number): Promise<void> {
        try {
            await serverAPI.delete(`${this.URL_BASE}/${key}`)
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async updateRecord(key: string | number, data: MenuOption | Record<string, any>): Promise<MenuOption[]> {
        try {
            const response = await serverAPI.put(`${this.URL_BASE}/${key}`, data)
            return response.data.data
        } catch (error: any) {
            if (error.response?.status === 404) {
                return []
            }
            throw new Error(error.message)
        }
    }

    public async search(conditions: Condition[], offset: number, limit: number, orden?: string): Promise<MenuOption[]> {
        const headers = { conditions: JSON.stringify({ conditions }), offset, limit, orden }
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/search`, { headers })
            return apiResponse.data
        } catch (error: any) {
            if (error.response?.status === 404) {
                return []
            }
            throw new Error(error.message)
        }
    }

    public async getAffectedRecordsByQuery(conditions: Condition[]): Promise<number> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/getAffectedRecordsByQuery`, {
                headers: { conditions: JSON.stringify({ conditions }) },
            })
            return apiResponse.data.affectedRecords
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getModelProperties(): Promise<ModelProperties> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/getModelProperties`)
            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}
