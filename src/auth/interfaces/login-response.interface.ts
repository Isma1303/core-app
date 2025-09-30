import { SessionInfo } from './session-info.interface'

export interface LoginResponse {
    isOk: boolean
    sessionInfo?: SessionInfo
    message?: string
}
