import { serverAPI } from '../../api/server.api'
import { LoginResponse, UserInfo } from '../interfaces'

const URL_BASE: string = '/user'

const authenticate = async (user: string, password: string): Promise<LoginResponse> => {
    try {
        const apiResponse = await serverAPI.post(`${URL_BASE}/authenticate`, { user, password: btoa(password) })
        const { message, statusCode, data, token, version } = apiResponse.data
        return {
            isOk: statusCode === 200,
            sessionInfo: {
                appVersion: version,
                user: data.user,
                token,
            },
            message,
        }
    } catch (error: any) {
        throw new Error(error.message)
    }
}

const getUserInfo = async (): Promise<UserInfo> => {
    try {
        const apiResponse = await serverAPI.get(`${URL_BASE}/getUserInfo`)
        const { data } = apiResponse.data
        return {
            version: data.version,
            actions: data.actions,
            maxMultipleUpdate: data.maxMultipleUpdate,
            user: data.user,
        }
    } catch (error: any) {
        throw new Error(error.message)
    }
}

const createAccount = async (email: string, password: string) => {
    try {
        // Send request
        console.log(email, password)

        return {
            isOk: true,
        }
    } catch {
        return {
            isOk: false,
            message: 'Failed to create account',
        }
    }
}

const changePassword = async (email: string, recoveryCode: string) => {
    try {
        // Send request
        console.log(email, recoveryCode)

        return {
            isOk: true,
        }
    } catch {
        return {
            isOk: false,
            message: 'Failed to change password',
        }
    }
}

const resetPassword = async (email: string) => {
    try {
        // Send request
        console.log(email)

        return {
            isOk: true,
        }
    } catch {
        return {
            isOk: false,
            message: 'Failed to reset password',
        }
    }
}

export { authenticate, createAccount, changePassword, resetPassword, getUserInfo }
