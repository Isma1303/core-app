import { useState } from 'react'
import { SystemActionsTabsOptions } from '../enums'
import { ContentTab } from '../interfaces'
import { RolesSystemActions, SystemActionsGrid } from '../components'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Boxes, ShieldUser } from 'lucide-react'

const assignmentsTabs: ContentTab[] = [
    {
        id: SystemActionsTabsOptions.SYSTEM_ACTIONS_CRUD,
        text: 'Acciones del Sistema',
        icon: <Boxes className="h-4 w-4" />,
    },
    {
        id: SystemActionsTabsOptions.ASSIGNMENTS,
        text: 'Asignaciones a roles',
        icon: <ShieldUser className="h-4 w-4" />,
    },
]

export const SystemActions = () => {
    const [indexTab, setIndexTab] = useState<SystemActionsTabsOptions>(SystemActionsTabsOptions.SYSTEM_ACTIONS_CRUD)

    return (
        <div className="space-y-4 p-4">
            <h2 className="content-block">Asignaciones de Permisos</h2>

            <Tabs value={String(indexTab)} onValueChange={(value) => setIndexTab(Number(value) as SystemActionsTabsOptions)}>
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
                {indexTab === SystemActionsTabsOptions.SYSTEM_ACTIONS_CRUD && <SystemActionsGrid />}
                {indexTab === SystemActionsTabsOptions.ASSIGNMENTS && <RolesSystemActions />}
            </div>
        </div>
    )
}
