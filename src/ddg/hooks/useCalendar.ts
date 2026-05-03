import { useCallback, useMemo, useState } from 'react'
import { ServiceEventsService } from '../services/service_events.service'
import { AttendanceService } from '../services/attendance.service'
import { IAttendance } from '../interfaces/attendance.interface'

export const useCalendar = () => {
    const serviceEventService = useMemo(() => new ServiceEventsService(), [])
    const attendanceService = useMemo(() => new AttendanceService(), [])
    const [loading, setLoading] = useState<boolean>(false)

    const loadUserEvents = useCallback(async () => {
        try {
            setLoading(true)
            const response = await serviceEventService.getRecords(-1, -1)
            return response
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [serviceEventService])

    const confirmAttendance = useCallback(async (attendance: IAttendance) => {
        try {
            setLoading(true)

            const response = await attendanceService.createRecord(attendance)
            return response
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [attendanceService])

    const notifyAbsence = useCallback(() => {}, [])

    return { loadUserEvents, confirmAttendance, notifyAbsence, loading }
}
