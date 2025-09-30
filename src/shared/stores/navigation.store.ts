/* eslint-disable no-unused-vars */

import { create, StateCreator } from 'zustand'
import { NavigationItem } from '../interfaces/navigation-item.interface'
import notify from 'devextreme/ui/notify'
import { getNestedMenuOptions } from '../services/menu-options.service'

export interface NavigationState {
    currentPath: string
    navigation: NavigationItem[]
}

interface Actions {
    isLoadingPaths: boolean
    setCurrentPath: (currentPath: string) => void
    loadNavigation: () => void
}

const storeApi: StateCreator<NavigationState & Actions> = (set) => ({
    isLoadingPaths: false,
    navigation: [],
    currentPath: '',

    setCurrentPath: (currentPath: string) => set({ currentPath }),
    loadNavigation: async () => {
        try {
            set({ isLoadingPaths: true })
            const response = await getNestedMenuOptions()
            set({ navigation: response, isLoadingPaths: false })
        } catch (error: any) {
            notify(error.message, 'error', 2000)
            set({ navigation: [], isLoadingPaths: false })
        }
    },
})

export const useNavigationStore = create<NavigationState & Actions>()(storeApi)
