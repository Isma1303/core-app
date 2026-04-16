export interface NavigationItem {
    text: string
    path?: string
    icon: string
    items?: NavigationItem[]
    id: number
    menu_option_id: number
    order: number
    parent_menu_option_id: number
}
