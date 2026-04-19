import { ReactNode } from 'react'

export interface ContentTab {
    id: number
    text: string
    icon?: ReactNode
    content?: string
}
