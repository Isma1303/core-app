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
            setRolesConfiguration(config)
        })
    }, [])

    return (
        <>
            <h2 className="content-block">Roles</h2>
            {rolesConfiguration && <ScpGrid configuration={rolesConfiguration!} />}
        </>
    )
}
