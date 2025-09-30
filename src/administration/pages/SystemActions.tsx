import { useState } from 'react'
import { SystemActionsTabsOptions } from '../enums'
import { ContentTab } from '../interfaces'
import { ItemClickEvent } from 'devextreme/ui/tabs'
import { RolesSystemActions, SystemActionsGrid } from '../components'
import { Tabs } from 'devextreme-react'

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

    const selectIndexTab = (selectedItemEvent: ItemClickEvent<ContentTab, any>) => {
        if (!selectedItemEvent.itemData) return

        setIndexTab(selectedItemEvent.itemData.id)
    }

    return (
        <>
            <h2 className="content-block">Asignaciones de Permisos</h2>

            <div className="row mx-3">
                <Tabs className="tab" dataSource={assignmentsTabs} selectedIndex={indexTab} onItemClick={selectIndexTab} stylingMode="primary" />
            </div>

            <div className="row mx-3">{indexTab === SystemActionsTabsOptions.SYSTEM_ACTIONS_CRUD && <SystemActionsGrid />}</div>
            <div className="row mx-3">{indexTab === SystemActionsTabsOptions.ASSIGNMENTS && <RolesSystemActions />}</div>
        </>
    )
}
