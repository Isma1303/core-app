import { useEffect, useState } from 'react'
import { useRolesDataGridConfig } from '../hooks'
import { Role } from '../interfaces'
import { RoleService } from '../services'
import { ScpGrid } from '../../shared/components'
import { ScpGridConfig } from '@/shared/interfaces/scp-grid-config.interface'
import { customStoreBuilder } from '@/shared/builders/custom-store-builder.builder'

export const Roles = (): JSX.Element => {
    const rolesService = new RoleService()

    const { obtenerConfig } = useRolesDataGridConfig(rolesService)

    const rolesCustomStore = customStoreBuilder<Role>(rolesService, 'role_id')
    const [rolesConfiguration, setRolesConfiguration] = useState<ScpGridConfig | null>(null)

    useEffect(() => {
        obtenerConfig(rolesCustomStore).then((config) => {
            config.allowCreate = true
            setRolesConfiguration(config)
        })
    }, [])

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Roles</h2>
                    <p className="text-muted-foreground text-sm">Administra los roles de usuario y sus permisos en el sistema.</p>
                </div>
            </div>

            <div className="px-4 pb-8">{rolesConfiguration && <ScpGrid configuration={rolesConfiguration!} />}</div>
        </div>
    )
}
