import { Tabs } from 'devextreme-react'
import { AssignmentsTabsOptions } from '../enums'
import { ContentTab } from '../interfaces'
import { useState } from 'react'
import { ItemClickEvent } from 'devextreme/ui/tabs'
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

            <div className="row mx-3">
                {indexTab === AssignmentsTabsOptions.ROLES && <UsersToRoles />}
                {indexTab === AssignmentsTabsOptions.ACTIONS && <ActionsToRoles />}
                {indexTab === AssignmentsTabsOptions.MENU_OPTIONS && <MenuOptionsToRoles />}
                {indexTab === AssignmentsTabsOptions.RECORDS && <div>RECORDS</div>}
            </div>
        </>
    )
}
