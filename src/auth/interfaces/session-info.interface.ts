import { UserLogin } from './user-login.interface'

export interface SessionInfo {
    appVersion: string
    user?: UserLogin
    token?: string
}
