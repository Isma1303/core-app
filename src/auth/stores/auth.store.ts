/* eslint-disable no-unused-vars */
import { create, StateCreator } from 'zustand'
import { SessionInfo, UserInfo, UserLogin } from '../interfaces'
import { devtools, persist } from 'zustand/middleware'
import { authenticate, getUserInfo } from '../services'
import notify from 'devextreme/ui/notify'
import { useSystemActionPermissionsStore } from '../../administration/stores'

export interface AuthState {
    status: boolean
    token?: string
    user?: UserLogin
    sessionInfo?: SessionInfo
    userInfo?: UserInfo
}

interface Actions {
    authenticate: (user: string, password: string) => Promise<boolean>
    deauthenticate: () => void
}

const storeApi: StateCreator<AuthState & Actions> = (set) => ({
    status: false,
    token: undefined,
    user: undefined,

    authenticate: async (user: string, password: string): Promise<boolean> => {
        try {
            const response = await authenticate(user, password)
            set({ status: true, token: response.sessionInfo!.token, user: response.sessionInfo!.user, sessionInfo: response.sessionInfo })

            const userInfoResponse = await getUserInfo()

            if (response.sessionInfo?.user) {
                const loadSystemActionsPermission = useSystemActionPermissionsStore.getState().loadPermissions
                await loadSystemActionsPermission(response.sessionInfo.user.user_id)
            }

            set({ userInfo: userInfoResponse })
            return true
        } catch (error: any) {
            set({ status: false, token: undefined, user: undefined })
            notify(error.message, 'error', 2000)
            return false
        }
    },
    deauthenticate: () => {
        set({ status: false, token: undefined, user: undefined })
    },
})

export const useAuthStore = create<AuthState & Actions>()(devtools(persist(storeApi, { name: 'auth' })))
