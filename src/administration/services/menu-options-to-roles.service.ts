import { serverAPI } from '../../api/server.api'
import { Condition, DataService, ModelProperties } from '../../shared/interfaces'
import { MenuOptionToRole } from '../interfaces'

export class MenuOptionsToRolesService implements DataService<MenuOptionToRole> {
    private readonly URL_BASE: string = '/role_menu_option'

    public async getRecord(key: string | number): Promise<MenuOptionToRole> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/${key}`)
            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getRecords(offset: number, limit: number, orden?: string): Promise<MenuOptionToRole[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(this.URL_BASE, {
                headers: { offset, limit, orden },
            })

            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getRoles(menuOptionId: number): Promise<MenuOptionToRole[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/getRoles/${menuOptionId}`)

            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getAdminMenuOptions(roleId: number): Promise<MenuOptionToRole[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/getAdminMenuOptions/${roleId}`)

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

    public async createRecord(data: MenuOptionToRole | never[]): Promise<MenuOptionToRole | never[]> {
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

    public async createRecords(data: MenuOptionToRole[]): Promise<MenuOptionToRole> {
        try {
            const response = await serverAPI.post(`${this.URL_BASE}/batchInsert`, data)

            return response.data.data
        } catch (error: any) {
            if (error.response?.status === 404) {
                return {} as MenuOptionToRole
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

    public async updateRecord(key: string | number, data: MenuOptionToRole | Record<string, any>): Promise<MenuOptionToRole[]> {
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

    public async search(conditions: Condition[], offset: number, limit: number, orden?: string): Promise<MenuOptionToRole[]> {
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

    public async deleteMenuOptions(conditions: Condition[]): Promise<number> {
        const headers = { conditions: JSON.stringify({ conditions }) }
        try {
            await serverAPI.delete(`${this.URL_BASE}/deleteByCondition`, { headers })
            return 1
        } catch (error: any) {
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
