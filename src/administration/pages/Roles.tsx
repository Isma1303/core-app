import { useEffect, useState } from 'react'
import { customStoreBuilder } from '../../shared/builders/custom-store-builder.builder'
import { useRolesDataGridConfig } from '../hooks'
import { Role } from '../interfaces'
import { RoleService } from '../services'
import { ScpGridConfig } from '../../shared/interfaces'
import { ScpGrid } from '../../shared/components'

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
