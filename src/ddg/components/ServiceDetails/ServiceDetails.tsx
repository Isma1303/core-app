import { IServiceEvent } from '@/ddg/interfaces/service_event.interface'
import { ServiceEventsService } from '@/ddg/services/service_events.service'
import { ServiceEventsUsersService } from '@/ddg/services/service_events_users.service'
import { Condition } from '@/shared/interfaces'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { UsersService } from '@/administration/services/users.service'
import { User } from '@/administration/interfaces'
import { Calendar, Clock, Activity, Users, Plus, Loader2, ArrowLeft, Trash, Send } from 'lucide-react'
import { useNavigate } from 'react-router'

export const ServiceDetails = () => {
    const [loading, setLoading] = useState(true)
    const [assigning, setAssigning] = useState(false)
    const [error, setError] = useState(false)
    const [service, setService] = useState<IServiceEvent | null>(null)
    const [serviceUsers, setServiceUsers] = useState<any[]>([])
    const [availableUsers, setAvailableUsers] = useState<User[]>([])
    const [selectedUserId, setSelectedUserId] = useState<string>('')

    const serviceEventService = new ServiceEventsService()
    const serviceEventsUsersService = new ServiceEventsUsersService()
    const usersService = new UsersService()

    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        await Promise.all([serviceEventDetail(), handleloadAssignedUsers(), loadAvailableUsers()])
        setLoading(false)
    }

    const serviceEventDetail = async () => {
        const conditions: Condition[] = [
            {
                field: 'service_event_id',
                operator: '=',
                value: id,
            },
        ]
        try {
            const response = await serviceEventService.search(conditions, -1, -1)
            const service = Array.isArray(response) ? response[0] : null
            setService(service)
        } catch (error) {
            console.log('error', error)
            setError(true)
        }
    }

    const handleloadAssignedUsers = async () => {
        try {
            const conditions: Condition[] = [
                {
                    field: 'service_event_id',
                    operator: '=',
                    value: id,
                },
            ]
            const response = await serviceEventsUsersService.search(conditions, -1, -1)
            setServiceUsers(Array.isArray(response) ? response : [])
        } catch (error) {
            console.log('error', error)
            setError(true)
        }
    }

    const loadAvailableUsers = async () => {
        try {
            const users = await usersService.getRecords(-1, -1)
            setAvailableUsers(users)
        } catch (error) {
            console.error('Error loading users', error)
        }
    }

    const handleAssignUser = async () => {
        if (!selectedUserId || !id) return

        try {
            setAssigning(true)
            await serviceEventsUsersService.createRecord({
                service_event_id: parseInt(id),
                user_id: parseInt(selectedUserId),
            })
            setSelectedUserId('')
            await handleloadAssignedUsers()
        } catch (error) {
            console.error('Error assigning user', error)
        } finally {
            setAssigning(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-background-primary" />
            </div>
        )
    }

    const handleRemoveUser = async (service_event_id: number, user_id: number) => {
        try {
            await serviceEventsUsersService.deleteUserFromService(service_event_id, user_id)
            await handleloadAssignedUsers()
        } catch (error) {
            console.error('Error removing user', error)
        }
    }

    const handleSendReminder = async (service_event_id: number) => {
        try {
            await serviceEventService.sendReminder(service_event_id)
        } catch (error) {
            console.error('Error sending reminder', error)
        }
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Volver
                </button>
                <button
                    onClick={() => handleSendReminder(Number(id))}
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <Send className="w-4 h-4 mr-1" /> Enviar Recordatorio
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Detalles principales */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="bg-muted/30 pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl font-bold text-foreground">{service?.service_nm}</CardTitle>
                                    <CardDescription className="mt-1">Detalles generales del evento</CardDescription>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${service?.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                >
                                    {service?.is_active ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center text-muted-foreground">
                                <Calendar className="w-5 h-5 mr-3 text-background-primary" />
                                <span className="text-sm font-medium">
                                    {service?.service_date
                                        ? new Date(service.service_date).toLocaleDateString('es-ES', {
                                              weekday: 'long',
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                          })
                                        : 'Fecha no especificada'}
                                </span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Clock className="w-5 h-5 mr-3 text-background-primary" />
                                <span className="text-sm font-medium">
                                    {service?.start_time} - {service?.end_time}
                                </span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Activity className="w-5 h-5 mr-3 text-background-primary" />
                                <span className="text-sm font-medium">ID de Ministerio: {service?.department_id}</span>
                            </div>
                            {service?.notes && (
                                <div className="mt-6 pt-4 border-t border-border/50">
                                    <h4 className="text-sm font-semibold mb-2">Notas adicionales</h4>
                                    <p className="text-sm text-muted-foreground italic bg-muted/20 p-4 rounded-lg">"{service.notes}"</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Columna de asignaciones */}
                <div className="space-y-6">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3 border-b border-border/50">
                            <CardTitle className="text-lg flex items-center">
                                <Users className="w-5 h-5 mr-2 text-background-primary" />
                                Servidores Asignados
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 px-4 space-y-4">
                            {/* Lista de usuarios */}
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {serviceUsers.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">No hay usuarios asignados.</p>
                                ) : (
                                    serviceUsers.map((su) => (
                                        <div
                                            key={su.user_id}
                                            className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-background-primary/20 text-background-primary flex items-center justify-center font-bold text-xs mr-3">
                                                {su.user_nm ? su.user_nm.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium leading-none">{su.name}</p>
                                                <p className="text-xs text-muted-foreground mt-1 truncate">{su.email || 'Sin correo'}</p>
                                            </div>
                                            <Button
                                                className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center"
                                                size="icon"
                                                onClick={() => handleRemoveUser(su.service_event_id!, su.user_id!)}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Formulario de asignación */}
                            <div className="pt-4 border-t border-border/50 space-y-3">
                                <h4 className="text-sm font-medium">Asignar nuevo usuario</h4>
                                <div className="flex gap-2">
                                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                        <SelectTrigger className="flex-1 text-sm">
                                            <SelectValue placeholder="Seleccionar..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableUsers.map((user) => (
                                                <SelectItem key={user.user_id} value={user.user_id!.toString()}>
                                                    {user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        size="icon"
                                        onClick={handleAssignUser}
                                        disabled={!selectedUserId || assigning}
                                        className="bg-background-primary hover:bg-background-primary/90 shrink-0"
                                    >
                                        {assigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
