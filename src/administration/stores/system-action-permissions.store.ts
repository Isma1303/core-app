/* eslint-disable no-unused-vars */
import { create, StateCreator } from 'zustand'
import { SystemAction } from '../interfaces'
import { SystemActionsToRolesService } from '../services'

interface SystemActionPermissionsState {
    permissions: SystemAction[]
    setPermissions: (newPermissions: SystemAction[]) => void
    loadPermissions: (userId: number) => Promise<void>
    hasPermission: (componentId: string) => boolean
}

const systemActionsToRolesService = new SystemActionsToRolesService()

const storeApi: StateCreator<SystemActionPermissionsState> = (set, get) => ({
    permissions: [],
    setPermissions: (newPermissions) => set({ permissions: newPermissions }),
    loadPermissions: async (userId: number) => {
        const permissions = await systemActionsToRolesService.getAssignedSystemActionsByUser(userId)
        set({ permissions })
    },
    hasPermission: (componentId) => {
        return get().permissions.some((p) => p.component_id === componentId && p.assigned)
    },
})

export const useSystemActionPermissionsStore = create<SystemActionPermissionsState>()(storeApi)
