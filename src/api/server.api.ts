/**
 * Axios instance configured for server API requests.
 *
 * This instance is pre-configured with the base URL for the server API and
 * default headers for JSON content type. It also includes an interceptor
 * to automatically add the authorization token from the authentication store
 * to the request headers if available.
 *
 * @module serverAPI
 *
 * @requires axios
 * @requires useAuthStore
 *
 * @example
 * import { serverAPI } from './path/to/server.api'
 *
 * serverAPI.get('/endpoint')
 *   .then(response => {
 *     console.log(response.data)
 *   })
 *   .catch(error => {
 *     console.error(error)
 *   })
 */
import axios from 'axios'
import { useAuthStore } from '../auth'
import { showErrorMessage } from '../shared/utils/show-error-message.util'

const BASE_URL = import.meta.env.VITE_API_URL

const serverAPI = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-type': 'application/json',
    },
})

/**
 * Adds a request interceptor to automatically include the authorization token.
 *
 * @function
 * @memberof module:serverAPI
 *
 * @param {Object} config - Axios request configuration object.
 * @returns {Object} Modified Axios request configuration with Authorization header if the token exists.
 *
 * @example
 * // Automatically adds token if available in auth store
 * serverAPI.interceptors.request.use((config) => {
 *     const token = useAuthStore.getState().token;
 *     if (token) {
 *         config.headers['Authorization'] = `Bearer ${token}`;
 *     }
 *     return config;
 * });
 */
serverAPI.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
})

/**
 * Adds a response interceptor to handle errors globally.
 *
 * - For status code `401`: Calls `deauthenticate` to log out the user.
 * - For other errors: Displays an error message using `showErrorMessage`.
 *
 * @function
 * @memberof module:serverAPI
 *
 * @param {Object} response - The successful response object from the server.
 * @returns {Object} The unmodified response object.
 *
 * @throws {Error} Handles unauthorized or other server errors.
 *
 * @example
 * serverAPI.interceptors.response.use(
 *     (response) => response,
 *     (error) => {
 *         const statusCode = error.response?.status;
 *         const errorMessage = error.response?.data?.errorMessage || error.message;
 *
 *         if (statusCode === 401) {
 *             const deauthenticate = useAuthStore.getState().deauthenticate;
 *             deauthenticate();
 *             return;
 *         }
 *
 *         showErrorMessage(errorMessage);
 *         return Promise.resolve({ data: [] });
 *     }
 * );
 */
serverAPI.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Any status codes outside the range of 2xx cause this function to trigger
        const statusCode = error.response?.status
        const errorMessage = error.response?.data?.errorMessage || error.message

        if (statusCode === 401) {
            const deauthenticate = useAuthStore.getState().deauthenticate
            deauthenticate()
            return
        }

        showErrorMessage(errorMessage)
        return Promise.resolve({ data: [] }) // Return an empty response to the caller
    }
)

export { serverAPI }
