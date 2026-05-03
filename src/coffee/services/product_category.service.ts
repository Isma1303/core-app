import { Condition, DataService, ModelProperties, ScpGridConfig } from '@/shared/interfaces'
import { IProductCategories } from '../interfaces/product_categories.interface'
import { serverAPI } from '@/api/server.api'

export class ProductCategoriesService implements DataService<IProductCategories> {
    private readonly URL_BASE: string = '/coffe/product-categories'

    public async getRecord(key: string | number): Promise<IProductCategories> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/${key}`)
            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getRecords(offset: number, limit: number, orden?: string): Promise<IProductCategories[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(this.URL_BASE, {
                headers: { offset, limit, orden },
            })

            return apiResponse?.data || []
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

    public async createRecord(data: IProductCategories | never[]): Promise<IProductCategories | never[]> {
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

    public async updateRecord(key: string | number, data: IProductCategories | Record<string, any>): Promise<IProductCategories[]> {
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

    public async search(conditions: Condition[], offset: number, limit: number, orden?: string): Promise<IProductCategories[]> {
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
