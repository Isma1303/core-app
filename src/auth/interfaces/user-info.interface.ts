import { UserLogin } from './user-login.interface'

export interface UserInfo {
    version: string
    actions: Record<string, boolean>
    maxMultipleUpdate: number
    user: UserLogin
}
