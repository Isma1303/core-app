import { useServiceEvents } from '../../hooks/useServiceEvents'
import { useEffect, useState } from 'react'
import { IServiceEventNew } from '@/ddg/interfaces/service_event.interface'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DepartmentsService } from '../../services/departments.service'
import { IDepartments } from '../../interfaces/departments.interface'
import { Plus, Calendar, Clock, FileText, Activity, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router'

export const Services = () => {
    const departmentsService = new DepartmentsService()
    const { loadServiceEvents, serviceEvents, loading, createServiceEvent } = useServiceEvents()
    const [departments, setDepartments] = useState<IDepartments[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const navigate = useNavigate()

    const [formData, setFormData] = useState<IServiceEventNew>({
        service_nm: '',
        department_id: 0,
        start_time: '',
        end_time: '',
        is_active: true,
        notes: '',
        service_date: new Date(),
    })

    useEffect(() => {
        loadServiceEvents()
        loadDepartments()
    }, [])

    const loadDepartments = async () => {
        try {
            const data = await departmentsService.getRecords(-1, -1)
            setDepartments(data)
        } catch (error) {
            console.error('Error loading departments', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await createServiceEvent(formData as any)
        if (result) {
            setIsDialogOpen(false)
            loadServiceEvents()
            setFormData({
                service_nm: '',
                department_id: 0,
                start_time: '',
                end_time: '',
                is_active: true,
                notes: '',
                service_date: new Date(),
            })
        }
    }

    const handleServiceDetails = (service_event_id: number) => {
        navigate(`/events/service-details/${service_event_id}`)
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Servicios</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-background-primary hover:bg-background-primary/90">
                            <Plus className="mr-2 h-4 w-4" /> Nuevo Servicio
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="service_nm">Nombre del Servicio</Label>
                                <Input
                                    id="service_nm"
                                    placeholder="Ej. Servicio de Domingo"
                                    value={formData.service_nm}
                                    onChange={(e) => setFormData({ ...formData, service_nm: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department">Departamento</Label>
                                <Select
                                    onValueChange={(value) => setFormData({ ...formData, department_id: parseInt(value) })}
                                    value={formData.department_id === 0 ? '' : formData.department_id.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar departamento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((dept) => (
                                            <SelectItem key={dept.department_id} value={dept.department_id.toString()}>
                                                {dept.department_nm}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="service_date">Fecha</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="service_date"
                                            type="date"
                                            className="pl-9"
                                            value={
                                                formData.service_date instanceof Date
                                                    ? formData.service_date.toISOString().split('T')[0]
                                                    : formData.service_date
                                            }
                                            onChange={(e) => setFormData({ ...formData, service_date: new Date(e.target.value) })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="is_active">Estado</Label>
                                    <Select
                                        onValueChange={(value) => setFormData({ ...formData, is_active: value === 'true' })}
                                        value={formData.is_active.toString()}
                                    >
                                        <SelectTrigger>
                                            <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="true">Activo</SelectItem>
                                            <SelectItem value="false">Inactivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_time">Hora Inicio</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="start_time"
                                            type="time"
                                            className="pl-9"
                                            value={formData.start_time}
                                            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_time">Hora Fin</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="end_time"
                                            type="time"
                                            className="pl-9"
                                            value={formData.end_time}
                                            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notas</Label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="notes"
                                        placeholder="Detalles adicionales..."
                                        className="pl-9"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={loading} className="bg-background-primary hover:bg-background-primary/90">
                                    {loading ? 'Guardando...' : 'Guardar Servicio'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceEvents.map((serviceEvent) => (
                    <Card
                        key={serviceEvent.service_event_id}
                        className="overflow-hidden border-border/50 hover:border-background-primary/50 transition-colors shadow-sm"
                    >
                        <CardHeader className="pb-2 bg-muted/30">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-bold">{serviceEvent.service_nm}</CardTitle>
                                <span
                                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${serviceEvent.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                >
                                    {serviceEvent.is_active ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-2 h-4 w-4 text-background-primary" />
                                {new Date(serviceEvent.service_date).toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-2 h-4 w-4 text-background-primary" />
                                {serviceEvent.start_time} - {serviceEvent.end_time}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Activity className="mr-2 h-4 w-4 text-background-primary" />
                                Ministerio: {departments.find((dept) => dept.department_id === serviceEvent.department_id)?.department_nm}
                            </div>
                            {serviceEvent.notes && (
                                <div className="pt-2 mt-2 border-t border-border/50">
                                    <p className="text-xs text-muted-foreground line-clamp-2 italic">"{serviceEvent.notes}"</p>
                                </div>
                            )}
                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border/50">
                                <button
                                    onClick={() => handleServiceDetails(serviceEvent.service_event_id)}
                                    className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#2FB7C7]/20 text-[#1D7984] hover:bg-[#2FB7C7]/30 transition-colors flex items-center"
                                >
                                    <i className="bi bi-eye mr-1"></i> Ver
                                </button>
                                <button className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center">
                                    <i className="bi bi-pencil mr-1"></i> Editar
                                </button>
                                <button className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center">
                                    <i className="bi bi-trash mr-1"></i> Eliminar
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {serviceEvents.length === 0 && !loading && (
                <div className="text-center py-20 border-2 border-dashed border-muted rounded-xl">
                    <p className="text-muted-foreground">No hay servicios registrados.</p>
                </div>
            )}
            {loading && <Loader2 className="w-full flex justify-center bg-background" />}
        </div>
    )
}
