export interface IUserCard {
    card_id: number
    user_id: number
    card_uuid: string
    qr_value: string
    is_active: boolean
    created_at: Date
    updated_at: Date
}

export interface IUserCardNew extends Omit<IUserCard, 'card_id'> {}
export interface IUserCardUpdate extends Partial<IUserCard> {}

export interface IQrScanRequest {
    qr_value: string
}

export interface IAttendanceRegisterRequest {
    service_event_id: number
    user_id: number
    attendance_status_id?: number
    notes?: string
}

export interface IUserBasicInfo {
    user_id: number
    user_nm: string
    user_lt: string
    is_active: boolean
}

export interface IServiceEventBasicInfo {
    service_event_id: number
    is_active: boolean
}

export interface IAttendanceInsert {
    service_event_id: number
    user_id: number
    attendance_status_id: number
    notes?: string
}
