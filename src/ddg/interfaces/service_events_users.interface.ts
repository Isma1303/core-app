export interface IServiceEventsUsers {
    service_event_id: number
    user_id: number
    user_nm?: string
    email?: string
}

export interface IServiceEventsUsersNew extends Omit<IServiceEventsUsers, ''> {}
export interface IServiceEventsUsersUpdate extends Partial<IServiceEventsUsers> {}
