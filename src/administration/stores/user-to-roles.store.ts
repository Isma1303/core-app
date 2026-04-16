/* eslint-disable no-unused-vars */
import { create, StateCreator } from 'zustand'
import { UsersToRolesService } from '../services'

interface UserToRoleState {
    getUserRoles: (userId: number) => Promise<Set<string>>
}

const userToRoleService = new UsersToRolesService()

const storeApi: StateCreator<UserToRoleState> = (set, get) => ({
    getUserRoles: async (userId: number) => {
        const roles = await userToRoleService.getAssignedRoles(userId)
        return new Set(roles.map((role) => role.role))
    },
})

export const useUserToRoleStore = create<UserToRoleState>()(storeApi)
