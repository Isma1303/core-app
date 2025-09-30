import { serverAPI } from '../../api/server.api'
import { Condition, DataService, ModelProperties } from '../../shared/interfaces'
import { SystemAction, SystemActionToRole } from '../interfaces'

export class SystemActionsToRolesService implements DataService<SystemActionToRole> {
    private readonly URL_BASE: string = '/role_system_action'

    public async getRecord(key: string | number): Promise<SystemActionToRole> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/${key}`)
            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getRecords(offset: number, limit: number, orden?: string): Promise<SystemActionToRole[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(this.URL_BASE, {
                headers: { offset, limit, orden },
            })

            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getRoles(systemActionId: number): Promise<SystemActionToRole[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/getRoles/${systemActionId}`)

            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getSystemActions(roleId: number): Promise<SystemAction[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/getSystemActions/${roleId}`)

            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getAssignedSystemActionsByUser(userId: number): Promise<SystemAction[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/getAssignedSystemActionsByUser/${userId}`)

            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getSystemActionsByName(roleId: number, systemActionName: string): Promise<SystemAction[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/getSystemActionsByName/${roleId}`, {
                headers: { system_action_name: systemActionName },
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

    public async createRecord(data: SystemActionToRole | never[]): Promise<SystemActionToRole | never[]> {
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

    public async createRecords(data: SystemActionToRole[]): Promise<SystemActionToRole> {
        try {
            const response = await serverAPI.post(`${this.URL_BASE}/batchInsert`, data)

            return response.data.data
        } catch (error: any) {
            if (error.response?.status === 404) {
                return {} as SystemActionToRole
            }
            throw new Error(error.message)
        }
    }

    public async createSystemActionsAssignments(data: { ids: number[]; role_id: number }): Promise<{ count_inserted: number; role_id: number }> {
        try {
            const response = await serverAPI.post(`${this.URL_BASE}/createSystemActionsAssignments`, data)

            return response.data.data
        } catch (error: any) {
            if (error.response?.status === 404) {
                return {} as { count_inserted: number; role_id: number }
            }
            throw new Error(error.message)
        }
    }

    public async deleteByCompositeKey(roleKey: string | number, systemActionsKey: string | number): Promise<void> {
        try {
            await serverAPI.delete(`${this.URL_BASE}/${roleKey}/${systemActionsKey}`)
        } catch (error: any) {
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

    public async updateRecord(key: string | number, data: SystemActionToRole | Record<string, any>): Promise<SystemActionToRole[]> {
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

    public async search(conditions: Condition[], offset: number, limit: number, orden?: string): Promise<SystemActionToRole[]> {
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

    public async deleteSystemActions(conditions: Condition[]): Promise<number> {
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
