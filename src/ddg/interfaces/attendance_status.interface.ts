export interface IAttendanceStatus {
    attendance_status_id: number
    attendance_status_cd: string
    attendance_status_nm: string
}

export interface IAttendanceStatusNew extends Omit<IAttendanceStatus, 'attendance_status_id'> {}
export interface IAttendanceStatusUpdate extends Partial<IAttendanceStatus> {}
