/* eslint-disable no-unused-vars */
import DevExpress from 'devextreme'
import {
    CellClickEvent,
    CellPreparedEvent,
    ContentReadyEvent,
    EditingStartEvent,
    EditorPreparingEvent,
    InitNewRowEvent,
    KeyDownEvent,
    RowClickEvent,
    RowDblClickEvent,
    RowExpandedEvent,
    RowInsertedEvent,
    RowPreparedEvent,
    RowRemovingEvent,
    RowUpdatedEvent,
    SavingEvent,
} from 'devextreme/ui/data_grid'
import { ScpGridConfig } from './scp-grid-config.interface'
import { DataGridRef, DataGridTypes } from 'devextreme-react/cjs/data-grid'

export interface ScpDataGridActions {
    onRowExpanded?: (event: RowExpandedEvent<DevExpress.common.GroupItem<any>, any>) => void
    onInitNewRow?: (event: InitNewRowEvent<DevExpress.common.GroupItem<any>, any>) => void
    onSelectionChanged?: (event: DataGridTypes.SelectionChangedEvent) => Promise<void>
    onRowInserted?: (event: RowInsertedEvent<DevExpress.common.GroupItem<any>, any>) => void
    onRowUpdated?: (event: RowUpdatedEvent<DevExpress.common.GroupItem<any>, any>) => void
    onEditorPreparing?: (event: EditorPreparingEvent<DevExpress.common.GroupItem<any>, any>) => void
    onEditorPreparingLocal?: (event: EditorPreparingEvent<DevExpress.common.GroupItem<any>, any>) => void
    onKeyDown?: (event: KeyDownEvent<DevExpress.common.GroupItem<any>, any>) => void
    onEditingStart?: (event: EditingStartEvent<DevExpress.common.GroupItem<any>, any>) => void
    onRowClick?: (event: RowClickEvent<DevExpress.common.GroupItem<any>, any>) => void
    onRowDblClick?: (event: RowDblClickEvent<DevExpress.common.GroupItem<any>, any>) => void
    onRowPrepared?: (event: RowPreparedEvent<DevExpress.common.GroupItem<any>, any>) => void
    onCellPrepared?: (event: CellPreparedEvent<DevExpress.common.GroupItem<any>, any>) => void
    onContentReady?: (event: ContentReadyEvent<DevExpress.common.GroupItem<any>, any>) => void
    onCellClick?: (event: CellClickEvent<DevExpress.common.GroupItem<any>, any>) => void
    onSaving?: (event: SavingEvent<DevExpress.common.GroupItem<any>, any>) => void
    onRowRemoving?: (event: RowRemovingEvent<DevExpress.common.GroupItem<any>, any>) => void
    getSelectedData: () => Promise<void>
    getSelectedDataDelete: () => Promise<void>
    exportGridToPDF: () => void
    exportGridToXLSX: () => void
    refreshDataGrid: () => void
}

export interface ScpDataGridProps {
    dataGrid: React.RefObject<DataGridRef<any, any>>
    configuration: ScpGridConfig
    onInitNewRow?: (event: InitNewRowEvent<DevExpress.common.GroupItem<any>, any>) => void
    onEscapeDown?: () => void
    onEditingStart?: (event: EditingStartEvent<DevExpress.common.GroupItem<any>, any>) => void
    onSelectionChanged?: (event: DataGridTypes.SelectionChangedEvent) => Promise<void>
    onEditorPreparing?: (event: EditorPreparingEvent<DevExpress.common.GroupItem<any>, any>) => void
    onRowClick?: (event: RowClickEvent<DevExpress.common.GroupItem<any>, any>) => void
    onRowDblClick?: (event: RowDblClickEvent<DevExpress.common.GroupItem<any>, any>) => void
    onRowPrepared?: (event: RowPreparedEvent<DevExpress.common.GroupItem<any>, any>) => void
    onCellPrepared?: (event: CellPreparedEvent<DevExpress.common.GroupItem<any>, any>) => void
    onContentReady?: (event: ContentReadyEvent<DevExpress.common.GroupItem<any>, any>) => void
    onCellClick?: (event: CellClickEvent<DevExpress.common.GroupItem<any>, any>) => void
    onSaving?: (event: SavingEvent<DevExpress.common.GroupItem<any>, any>) => void
    onRowRemoving?: (event: RowRemovingEvent<DevExpress.common.GroupItem<any>, any>) => void
}

export interface UseDataGridEventsEmits {
    onDetailsFilter?: (param: string | number) => void
    newInitializedRow?: (param: any) => void
    informationRow?: (param: any) => void
    selectionChange?: (param: any) => void
    rowDataUpdated?: (param: any) => void
    getSelectedDataEvent?: (param: { keys: any; record: any }) => void
    getSelectedDataEventDelete?: (param: { keys: any; record: any }) => void
}
