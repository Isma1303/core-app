/* eslint-disable no-unused-vars */
import { ScpGridConfig } from '../interfaces/scp-grid-config.interface'

import {
    CellClickEvent,
    CellPreparedEvent,
    ContentReadyEvent,
    EditingStartEvent,
    EditorPreparingEvent,
    InitNewRowEvent,
    RowClickEvent,
    RowDblClickEvent,
    RowPreparedEvent,
    SavingEvent,
    RowRemovingEvent,
} from 'devextreme/ui/data_grid'
import DevExpress from 'devextreme'
import { DataGridTypes } from 'devextreme-react/cjs/data-grid'

export interface ScpGridProps {
    configuration: ScpGridConfig
    detailsConfiguration?: ScpGridConfig
    disabled?: boolean
}

export interface ScpGridActionsProps {
    onInitNewRow?: (e: InitNewRowEvent<DevExpress.common.GroupItem<any>, any>) => void
    onSelectionChanged?: (e: DataGridTypes.SelectionChangedEvent) => Promise<void>
    onEditorPreparing?: (e: EditorPreparingEvent<DevExpress.common.GroupItem<any>, any>) => void
    onRowPrepared?: (e: RowPreparedEvent<DevExpress.common.GroupItem<any>, any>) => void
    onRowClick?: (e: RowClickEvent<DevExpress.common.GroupItem<any>, any>) => void
    onRowDblClick?: (e: RowDblClickEvent<DevExpress.common.GroupItem<any>, any>) => void
    onEscapeDown?: () => void
    onEditingStart?: (e: EditingStartEvent<DevExpress.common.GroupItem<any>, any>) => void
    onCellPrepared?: (e: CellPreparedEvent<DevExpress.common.GroupItem<any>, any>) => void
    onContentReady?: (e: ContentReadyEvent<DevExpress.common.GroupItem<any>, any>) => void
    onCellClick?: (e: CellClickEvent<DevExpress.common.GroupItem<any>, any>) => void
    onSaving?: (e: SavingEvent<DevExpress.common.GroupItem<any>, any>) => void
    customButtonClicked?: (param: string) => Promise<void>
    onRowRemoving?: (e: RowRemovingEvent<DevExpress.common.GroupItem<any>, any>) => void
}

export interface ScpGridEmitsEvents {
    onDetailsFilter?: (param: string | number) => void
    newInitializedRow?: (param: any) => void
    informationRow?: (param: any) => void
    selectionChange?: (param: any) => void
    rowDataUpdated?: (param: any) => void
    addRow?: (param: any) => void
    getSelectedDataEvent?: (param: { keys: any; record: any }) => void
    getSelectedDataEventDelete?: (param: { keys: any; record: any }) => void
    customButtonClicked?: (param: string) => void
    sendBatchLoad?: (param: boolean) => void
}
