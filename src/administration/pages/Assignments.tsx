import { AssignmentsTabsOptions } from '../enums'
import { ContentTab } from '../interfaces'
import { useState } from 'react'
import { ActionsToRoles, UsersToRoles, MenuOptionsToRoles } from '../components'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShieldCheck, UserRoundCog, ListChecks, Table2 } from 'lucide-react'

export const Assignments = () => {
    const [indexTab, setIndexTab] = useState<AssignmentsTabsOptions>(AssignmentsTabsOptions.ROLES)

    const assignmentsTabs: ContentTab[] = [
        {
            id: AssignmentsTabsOptions.ROLES,
            text: 'Roles',
            icon: <ShieldCheck className="h-4 w-4" />,
        },
        {
            id: AssignmentsTabsOptions.ACTIONS,
            text: 'Acciones',
            icon: <UserRoundCog className="h-4 w-4" />,
        },
        {
            id: AssignmentsTabsOptions.MENU_OPTIONS,
            text: 'Opciones de Menú',
            icon: <ListChecks className="h-4 w-4" />,
        },
        {
            id: AssignmentsTabsOptions.RECORDS,
            text: 'Registros',
            icon: <Table2 className="h-4 w-4" />,
        },
    ]

    return (
        <div className="space-y-4 p-4">
            <h2 className="content-block">Asignaciones de Permisos</h2>

            <Tabs value={String(indexTab)} onValueChange={(value) => setIndexTab(Number(value) as AssignmentsTabsOptions)}>
                <TabsList className="w-full justify-start overflow-x-auto" variant="line">
                    {assignmentsTabs.map((tab) => (
                        <TabsTrigger key={tab.id} value={String(tab.id)} className="gap-2 whitespace-nowrap">
                            {tab.icon}
                            {tab.text}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="rounded-xl border border-border bg-card p-4">
                {indexTab === AssignmentsTabsOptions.ROLES && <UsersToRoles />}
                {indexTab === AssignmentsTabsOptions.ACTIONS && <ActionsToRoles />}
                {indexTab === AssignmentsTabsOptions.MENU_OPTIONS && <MenuOptionsToRoles />}
                {indexTab === AssignmentsTabsOptions.RECORDS && <div>RECORDS</div>}
            </div>
        </div>
    )
}
