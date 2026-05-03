export interface IServiceEvent {
    service_event_id: number
    service_nm: string
    service_date: Date | string
    start_time: string
    end_time: string
    is_active: boolean
    department_id: number
    notes: string
}

export interface IServiceEventNew extends Omit<IServiceEvent, 'service_event_id'> {}
export interface IServiceEventUpdate extends Partial<IServiceEvent> {}
