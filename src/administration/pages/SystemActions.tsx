import { useState } from 'react'
import { SystemActionsTabsOptions } from '../enums'
import { ContentTab } from '../interfaces'
import { RolesSystemActions, SystemActionsGrid } from '../components'

const assignmentsTabs: ContentTab[] = [
    {
        id: SystemActionsTabsOptions.SYSTEM_ACTIONS_CRUD,
        text: 'Acciones del Sistema',
        icon: 'bi bi-diagram-3-fill',
    },
    {
        id: SystemActionsTabsOptions.ASSIGNMENTS,
        text: 'Asignaciones a roles',
        icon: 'bi bi-file-person-fill',
    },
]

export const SystemActions = () => {
    const [indexTab, setIndexTab] = useState<SystemActionsTabsOptions>(SystemActionsTabsOptions.SYSTEM_ACTIONS_CRUD)

    return (
        <div style={{ padding: '1rem' }}>
            <h2 className="content-block">Asignaciones de Permisos</h2>

            <div className="row mx-3" style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', display: 'flex', gap: '1rem' }}>
                {assignmentsTabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setIndexTab(tab.id)}
                        style={{ 
                            padding: '0.5rem 1rem', 
                            border: 'none', 
                            background: 'none',
                            borderBottom: indexTab === tab.id ? '2px solid blue' : 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <i className={tab.icon}></i> {tab.text}
                    </button>
                ))}
            </div>

            <div className="row mx-3">{indexTab === SystemActionsTabsOptions.SYSTEM_ACTIONS_CRUD && <SystemActionsGrid />}</div>
            <div className="row mx-3">{indexTab === SystemActionsTabsOptions.ASSIGNMENTS && <RolesSystemActions />}</div>
        </div>
    )
}
