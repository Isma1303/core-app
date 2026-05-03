import { Button } from '@/components/ui/button'
import { useDepartmentsDataGridConfig } from '@/ddg/hooks/useDepartmentsDataGridConfig'
import { IDepartments } from '@/ddg/interfaces/departments.interface'
import { DepartmentsService } from '@/ddg/services/departments.service'
import { customStoreBuilder } from '@/shared/builders/custom-store-builder.builder'
import { ScpGrid } from '@/shared/components'
import { ScpGridConfig } from '@/shared/interfaces'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Departments = () => {
    const navigate = useNavigate()
    const service = new DepartmentsService()
    const { obtenerConfig } = useDepartmentsDataGridConfig(service)

    const departmentsCustomStore = customStoreBuilder<IDepartments>(service, 'department_id')
    const [departmentsConfig, setDepartmentsConfig] = useState<ScpGridConfig | null>(null)

    useEffect(() => {
        obtenerConfig(departmentsCustomStore).then((config) => {
            setDepartmentsConfig(config)
        })
    }, [])

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Ministerios</h2>
                    <p className="text-muted-foreground text-sm">Administra los ministerios del sistema.</p>
                </div>
                <Button variant="outline" onClick={() => navigate('/catalogs')}>
                    <i className="bi bi-arrow-left mr-2" />
                    Volver
                </Button>
            </div>

            <div className="px-4 pb-8">{departmentsConfig && <ScpGrid configuration={departmentsConfig!} />}</div>
        </div>
    )
}
