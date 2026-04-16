/* eslint-disable indent */
/* eslint-disable no-prototype-builtins */
import { DataService } from '../../shared/interfaces'
import { useAuthStore } from '../../auth'
import { User } from '../interfaces'
import { useState } from 'react'

export const useUsersDataGridConfig = (tablesService: DataService<User>, datagrid: React.RefObject<any>) => {
    const userInfo = useAuthStore((state) => state.userInfo)

    const [userData, setUserData] = useState<User | null>(null)
    const [showPasswordChangeForm, setShowPasswordChangeForm] = useState<boolean>(false)
    const [showUserForm, setShowUserForm] = useState<boolean>(false)

    const obtenerConfig = async (dataSource: any): Promise<any> => {
        const config: any = {
            dataSource: dataSource,
            dataId: 'user_id',
            columns: [
                {
                    dataField: 'user',
                    caption: 'Usuario',
                    allowFiltering: true,
                    validationRules: [
                        {
                            type: 'required',
                            message: 'El campo es requerido',
                        },
                        {
                            type: 'stringLength',
                            min: 1,
                            max: 200,
                            message: 'El campo debe tener entre 1 y 200 caracteres',
                        },
                    ],
                },
                {
                    dataField: 'name',
                    caption: 'Nombre',
                    allowFiltering: true,
                    validationRules: [
                        {
                            type: 'required',
                            message: 'El campo es requerido',
                        },
                        {
                            type: 'stringLength',
                            min: 1,
                            max: 50,
                            message: 'El campo debe tener entre 1 y 50 caracteres',
                        },
                    ],
                },
                {
                    dataField: 'email',
                    caption: 'Correo Electrónico',
                    allowFiltering: true,
                    validationRules: [
                        {
                            type: 'stringLength',
                            max: 200,
                            message: 'El campo debe tener máximo 200 caracteres',
                        },
                    ],
                },
                {
                    dataField: 'status',
                    caption: 'Estado',
                    dataType: 'boolean',
                    allowFiltering: true,
                },
            ],
            showBorders: true,
            showSearch: true,
            showFilters: true,
            allowReordering: true,
            allowColumnSelection: true,
            pageRecords: [5, 10, 20],
            allowUpdate: false,
            allowDelete: false,
            allowCreate: false,
            allowExportPDF: true,
            fileName: 'Usuarios',
            allowExportExcel: true,
            remoteOperations: { grouping: false, filtering: true, paging: true },
            deferredLoading: true,
            buttonsInLastColumn: true,
            margin: 'mx-3',
            editSelection: false,
            customAdd: false,
            customButtons: [],
        }
        const modelProperties = await tablesService.getModelProperties()
        const table = modelProperties?.tableName.toUpperCase()

        config.customButtons = []

        if (!userInfo?.actions.hasOwnProperty(table!)) {
            config.dataSource = []
            return config
        }

        if (userInfo.actions[table!]) {
            config.customButtons = [
                {
                    icon: 'key',
                    hint: 'Cambiar Contraseña',
                    name: 'changePassword',
                },
            ]
            config.editSelection = true
            config.allowDelete = true
            config.customAdd = true
            config.buttonsInLastColumn = false
            return config
        }
        return config
    }

    const customButtonClicked = async (buttonName: string) => {
        switch (buttonName) {
            case 'changePassword': {
                setShowPasswordChangeForm(false)
                const selectedRows: any[] | undefined = await datagrid.current?.instance().getSelectedRowsData()
                if (selectedRows && selectedRows.length === 0)
                    return alert('Debe seleccionar un registro / solo puede seleccionar 1 registro')

                if (selectedRows && selectedRows.length > 1) {
                    const selectedKeys: any[] | undefined = await datagrid.current?.instance().getSelectedRowKeys()
                    if (selectedKeys) selectedKeys.pop()
                    datagrid.current?.instance().deselectRows(selectedKeys as any[])
                }

                if (!selectedRows || !selectedRows[0]) return

                const userData = selectedRows[0]
                userData.password = ''
                setUserData(userData)
                setShowPasswordChangeForm(true)

                break
            }
        }
    }

    const enableUserForm = (formDataEvent: any) => {
        if (typeof formDataEvent === 'boolean') {
            setUserData({} as User)
            setShowUserForm(true)
            return
        }

        if (formDataEvent.record && formDataEvent.record.user_id !== undefined) {
            setUserData(formDataEvent.record)
            setShowUserForm(true)
            return
        }

        alert('Debe seleccionar un registro')
    }

    const onRowAffected = (rowAffected: boolean) => {
        if (rowAffected) alert('Registro actualizado con éxito')

        setShowPasswordChangeForm(false)
        setShowUserForm(false)
        setUserData(null)
        datagrid.current?.instance().refresh()
    }

    const unmountForm = () => {
        setShowPasswordChangeForm(false)
        setShowUserForm(false)
        setUserData(null)
    }

    return {
        obtenerConfig,
        customButtonClicked,
        userData,
        showPasswordChangeForm,
        enableUserForm,
        onRowAffected,
        showUserForm,
        unmountForm,
    }
}
