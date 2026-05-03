import { useState } from 'react'
import { ServiceEventsService } from '../services/service_events.service'
import { IServiceEvent, IServiceEventUpdate } from '../interfaces/service_event.interface'

export const useServiceEvents = () => {
    const serviceEventsService = new ServiceEventsService()
    const [serviceEvents, setServiceEvents] = useState<IServiceEvent[]>([])
    const [loading, setLoading] = useState(false)

    const loadServiceEvents = async () => {
        try {
            setLoading(true)
            const response = await serviceEventsService.getRecords(-1, -1)
            setServiceEvents(response)

            return response
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const createServiceEvent = async (serviceEvent: IServiceEvent) => {
        try {
            setLoading(true)
            const response = await serviceEventsService.createRecord(serviceEvent)
            return response
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const updateServiceEvent = async (service_event_id: number, serviceEvent: IServiceEventUpdate) => {
        try {
            setLoading(true)
            const response = await serviceEventsService.updateRecord(service_event_id, serviceEvent)
            return response
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return { loadServiceEvents, serviceEvents, loading, createServiceEvent, updateServiceEvent }
}
