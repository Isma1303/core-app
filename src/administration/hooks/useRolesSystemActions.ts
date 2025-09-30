/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Dispatch, useState } from 'react'
import { SystemActionsToRolesService } from '../services'
import { SystemAction } from '../interfaces'
import { SwitchTypes } from 'devextreme-react/switch'
import { SelectBoxTypes } from 'devextreme-react/select-box'
import { ButtonTypes } from 'devextreme-react/button'
import { confirm } from 'devextreme/ui/dialog'
import notify from 'devextreme/ui/notify'

interface UseRolesSystemActions {
    systemActions: SystemAction[]
    selectedRoleId: number
    isLoadingData: boolean
    systemActionName: string
    onRoleChanged: (event: SelectBoxTypes.ValueChangedEvent) => Promise<void>
    setSystemActionName: Dispatch<React.SetStateAction<string>>
    valueSwitchChanged: (event: SwitchTypes.ValueChangedEvent, data: SystemAction) => void
    loadSystemActionsData: (roleId: number, systemActionName?: string) => Promise<void>
    onSubmitChanges: (event: ButtonTypes.ClickEvent) => Promise<void>
    changeSelectionAll: (assignedValue: boolean) => Promise<void>
}

const rolesSystemActionService = new SystemActionsToRolesService()

export const useRolesSystemActions = (): UseRolesSystemActions => {
    const [systemActions, setSystemActions] = useState<SystemAction[]>([])
    const [selectedRoleId, setSelectedRoleId] = useState<number>(0)
    const [isLoadingData, setIsLoadingData] = useState<boolean>(false)
    const [systemActionName, setSystemActionName] = useState<string>('')

    const valueSwitchChanged = (event: SwitchTypes.ValueChangedEvent, data: SystemAction) => {
        setSystemActions((prev) => {
            const newActions = prev.map((action) => {
                if (action.system_action_id === data.system_action_id) {
                    action.assigned = event.value
                }
                return action
            })

            return newActions
        })
    }

    const onRoleChanged = async (event: SelectBoxTypes.ValueChangedEvent) => {
        if (event.value === null) {
            setSystemActions([])
            setSelectedRoleId(0)
            return
        }

        setSelectedRoleId(event.value)
        await loadSystemActionsData(event.value)
    }

    const loadSystemActionsData = async (roleId: number, systemActionName: string = ''): Promise<void> => {
        if (roleId === 0) return

        setIsLoadingData(true)
        let dataSystemActions: SystemAction[] = []

        if (systemActionName === '') {
            dataSystemActions = await rolesSystemActionService.getSystemActions(roleId)
        } else {
            dataSystemActions = await rolesSystemActionService.getSystemActionsByName(roleId, systemActionName)
        }

        setSystemActions(dataSystemActions)
        setIsLoadingData(false)
    }

    const onSubmitChanges = async (event: ButtonTypes.ClickEvent): Promise<void> => {
        const userConfirm = await confirm('¿Desea guardar los cambios realizados?', 'Confirmar cambios')
        if (!userConfirm) return

        const assignedData = systemActions.filter((action) => action.assigned)
        const assignedResponse = await rolesSystemActionService.createSystemActionsAssignments({
            ids: assignedData.map((action) => action.system_action_id!),
            role_id: selectedRoleId,
        })

        if (assignedResponse) {
            notify('Cambios guardados correctamente', 'success', 3000)
        }
        await loadSystemActionsData(selectedRoleId, systemActionName)
    }

    const changeSelectionAll = async (assignedValue: boolean): Promise<void> => {
        const userConfirm = await confirm('¿Desea cambiar la selección de todas las acciones?', 'Confirmar cambios')
        if (!userConfirm) return
        setIsLoadingData(true)
        setSystemActions((prev) => prev.map((action) => ({ ...action, assigned: assignedValue })))
        setIsLoadingData(false)
    }

    return {
        systemActions,
        selectedRoleId,
        isLoadingData,
        systemActionName,
        setSystemActionName,
        valueSwitchChanged,
        onRoleChanged,
        loadSystemActionsData,
        onSubmitChanges,
        changeSelectionAll,
    }
}
