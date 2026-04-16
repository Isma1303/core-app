import { serverAPI } from '../../api/server.api'
import { Condition, DataService, ModelProperties } from '../../shared/interfaces'
import { ActionToRole } from '../interfaces'

export class ActionsToRolesService implements DataService<ActionToRole> {
    private readonly URL_BASE: string = '/role_action'

    public async getRecord(key: string | number): Promise<ActionToRole> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/${key}`)
            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getRecords(offset: number, limit: number, orden?: string): Promise<ActionToRole[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(this.URL_BASE, {
                headers: { offset, limit, orden },
            })

            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getRoles(actionId: number): Promise<ActionToRole[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/getRoles/${actionId}`)

            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getActions(roleId: number): Promise<ActionToRole[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/getActions/${roleId}`)

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

    public async createRecord(data: ActionToRole | never[]): Promise<ActionToRole | never[]> {
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

    public async createRecords(data: ActionToRole[]): Promise<ActionToRole> {
        try {
            const response = await serverAPI.post(`${this.URL_BASE}/batchInsert`, data)

            return response.data.data
        } catch (error: any) {
            if (error.response?.status === 404) {
                return {} as ActionToRole
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

    public async updateRecord(key: string | number, data: ActionToRole | Record<string, any>): Promise<ActionToRole[]> {
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

    public async search(conditions: Condition[], offset: number, limit: number, orden?: string): Promise<ActionToRole[]> {
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

    public async deleteActions(conditions: Condition[]): Promise<number> {
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
