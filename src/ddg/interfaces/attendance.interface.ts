export interface IAttendance {
    attendance_id: number
    service_event_id: number
    user_id: number
    attendance_status_id: number
    notes: string
}

export interface IAttendanceNew extends Omit<IAttendance, 'attendance_id'> {}
export interface IAttendanceUpdate extends Partial<IAttendance> {}
