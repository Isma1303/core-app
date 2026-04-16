import { AssignmentsTabsOptions } from '../enums'
import { ContentTab } from '../interfaces'
import { useState } from 'react'
import { ActionsToRoles, UsersToRoles, MenuOptionsToRoles } from '../components'

export const Assignments = () => {
    const [indexTab, setIndexTab] = useState<AssignmentsTabsOptions>(AssignmentsTabsOptions.ROLES)

    const assignmentsTabs: ContentTab[] = [
        {
            id: AssignmentsTabsOptions.ROLES,
            text: 'Roles',
            icon: 'bi bi-person-rolodex',
        },
        {
            id: AssignmentsTabsOptions.ACTIONS,
            text: 'Acciones',
            icon: 'bi bi-person-lines-fill',
        },
        {
            id: AssignmentsTabsOptions.MENU_OPTIONS,
            text: 'Opciones de Menú',
            icon: 'bi bi-ui-checks',
        },
        {
            id: AssignmentsTabsOptions.RECORDS,
            text: 'Registros',
            icon: 'bi bi-table',
        },
    ]

    return (
        <div style={{ padding: '1rem' }}>
            <h2 className="content-block">Asignaciones de Permisos</h2>

            <div className="row mx-3" style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', display: 'flex', gap: '1rem', overflowX: 'auto' }}>
                {assignmentsTabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setIndexTab(tab.id)}
                        style={{ 
                            padding: '0.5rem 1rem', 
                            border: 'none', 
                            background: 'none',
                            borderBottom: indexTab === tab.id ? '2px solid blue' : 'none',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <i className={tab.icon}></i> {tab.text}
                    </button>
                ))}
            </div>

            <div className="row mx-3">
                {indexTab === AssignmentsTabsOptions.ROLES && <UsersToRoles />}
                {indexTab === AssignmentsTabsOptions.ACTIONS && <ActionsToRoles />}
                {indexTab === AssignmentsTabsOptions.MENU_OPTIONS && <MenuOptionsToRoles />}
                {indexTab === AssignmentsTabsOptions.RECORDS && <div>RECORDS</div>}
            </div>
        </div>
    )
}
