export interface MenuOption {
    menu_option_id?: number
    menu_option: string
    icon: string
    path: string
    sort: string
    items?: MenuOption[]
    parent_menu_option_id: number
}

export interface MenuOptionNew extends Omit<MenuOption, 'menu_option_id'> {}
