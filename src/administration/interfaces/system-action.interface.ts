export interface SystemAction {
    system_action_id?: number
    system_action_name: string
    component_id: string
    module_name: string
    route_path: string
    http_method: string
    action_type: string
    priority?: number
    description: string
    is_active: boolean
    assigned?: boolean
}
