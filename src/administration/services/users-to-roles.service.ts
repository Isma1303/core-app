import { serverAPI } from '../../api/server.api'
import { Condition, DataService, ModelProperties } from '../../shared/interfaces'
import { Role, UserToRole } from '../interfaces'

export class UsersToRolesService implements DataService<UserToRole> {
    private readonly URL_BASE: string = '/user_role'

    public async getRecord(key: string | number): Promise<UserToRole> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/${key}`)
            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getRecords(offset: number, limit: number, orden?: string): Promise<UserToRole[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(this.URL_BASE, {
                headers: { offset, limit, orden },
            })

            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getRoles(userId: number): Promise<UserToRole[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/getRoles/${userId}`)

            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
    public async getAssignedRoles(userId: number): Promise<Role[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/getAssignedRoles/${userId}`)

            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getUsers(roleId: number): Promise<UserToRole[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/getUsers/${roleId}`)

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

    public async createRecord(data: UserToRole | never[]): Promise<UserToRole | never[]> {
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

    public async createRecords(data: UserToRole[]): Promise<UserToRole> {
        try {
            const response = await serverAPI.post(`${this.URL_BASE}/batchInsert`, data)

            return response.data.data
        } catch (error: any) {
            if (error.response?.status === 404) {
                return {} as UserToRole
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

    public async updateRecord(key: string | number, data: UserToRole | Record<string, any>): Promise<UserToRole[]> {
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

    public async search(conditions: Condition[], offset: number, limit: number, orden?: string): Promise<UserToRole[]> {
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

    public async deleteUsers(conditions: Condition[]): Promise<number> {
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
