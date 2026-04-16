/* eslint-disable no-unused-vars */
import React from 'react'

export interface HeaderProps {
    menuToggleEnabled: boolean
    title?: string
    toggleMenu: (e: React.MouseEvent) => void
    image?: string
}

export interface SideNavigationMenuProps {
    selectedItemChanged: (e: any) => void
    openMenu: (e: React.MouseEvent | React.PointerEvent) => void
    compactMode: boolean
    onMenuReady?: (e: any) => void
}

export interface UserPanelProps {
    menuMode: 'context' | 'list'
}

export interface User {
    email: string
    avatarUrl: string
}

export type AuthContextType = {
    user?: User
    signIn: (email: string, password: string) => Promise<{ isOk: boolean; data?: User; message?: string }>
    signOut: () => void
    loading: boolean
}

export interface SideNavToolbarProps {
    title: string
}

export interface SingleCardProps {
    title?: string
    description?: string
}

export type Handle = () => void

interface NavigationData {
    currentPath: string
}

export type NavigationContextType = {
    setNavigationData?: ({ currentPath }: NavigationData) => void
    navigationData: NavigationData
}

export type ValidationType = {
    value: string
}
