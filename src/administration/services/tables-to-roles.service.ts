import { serverAPI } from '../../api/server.api'
import { Condition, DataService, ModelProperties } from '../../shared/interfaces'
import { TableToRole } from '../interfaces'

export class TablesToRolesService implements DataService<TableToRole> {
    private readonly URL_BASE: string = '/table_role_record'

    public async getRecord(key: string | number): Promise<TableToRole> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/${key}`)
            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getRecords(offset: number, limit: number, orden?: string): Promise<TableToRole[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(this.URL_BASE, {
                headers: { offset, limit, orden },
            })

            return apiResponse.data
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async getAssignedTableRecordsRLS(roleKey: number, tableKey: number): Promise<TableToRole[]> {
        try {
            const { data: apiResponse } = await serverAPI.get(`${this.URL_BASE}/getAssignedTableRecordsRLS/${roleKey}/${tableKey}`)

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

    public async createRecord(data: TableToRole | never[]): Promise<TableToRole | never[]> {
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

    public async createRecords(data: TableToRole[]): Promise<TableToRole> {
        try {
            const response = await serverAPI.post(`${this.URL_BASE}/batchInsert`, data)

            return response.data.data
        } catch (error: any) {
            if (error.response?.status === 404) {
                return {} as TableToRole
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

    public async deleteRecordComposeKeys(firstKey: string | number, secondKey: string | number): Promise<void> {
        try {
            await serverAPI.delete(`${this.URL_BASE}/${firstKey}/${secondKey}`)
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async deleteRoles(recordKey: string | number): Promise<void> {
        try {
            await serverAPI.delete(`${this.URL_BASE}/deleteRoles/${recordKey}`)
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async deleteTableRecords(roleKey: string | number): Promise<void> {
        try {
            await serverAPI.delete(`${this.URL_BASE}/deleteTableRecords/${roleKey}`)
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    public async updateRecord(key: string | number, data: TableToRole | Record<string, any>): Promise<TableToRole[]> {
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

    public async updateTableRecords(data: TableToRole | Record<string, any>): Promise<TableToRole[]> {
        try {
            const response = await serverAPI.put(`${this.URL_BASE}/updateTableRecords`, data)
            return response.data.data
        } catch (error: any) {
            if (error.response?.status === 404) {
                return []
            }
            throw new Error(error.message)
        }
    }

    public async search(conditions: Condition[], offset: number, limit: number, orden?: string): Promise<TableToRole[]> {
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
