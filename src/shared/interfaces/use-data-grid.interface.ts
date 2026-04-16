/* eslint-disable no-unused-vars */

export interface ScpDataGridActions {
    onRowExpanded?: (event: any) => void
    onInitNewRow?: (event: any) => void
    onSelectionChanged?: (event: any) => Promise<void>
    onRowInserted?: (event: any) => void
    onRowUpdated?: (event: any) => void
    onEditorPreparing?: (event: any) => void
    onEditorPreparingLocal?: (event: any) => void
    onKeyDown?: (event: any) => void
    onEditingStart?: (event: any) => void
    onRowClick?: (event: any) => void
    onRowDblClick?: (event: any) => void
    onRowPrepared?: (event: any) => void
    onCellPrepared?: (event: any) => void
    onContentReady?: (event: any) => void
    onCellClick?: (event: any) => void
    onSaving?: (event: any) => void
    onRowRemoving?: (event: any) => void
    getSelectedData: () => Promise<void>
    getSelectedDataDelete: () => Promise<void>
    exportGridToPDF: () => void
    exportGridToXLSX: () => void
    refreshDataGrid: () => void
}

export interface ScpDataGridProps {
    dataGrid: React.RefObject<any>
    configuration: any
    onInitNewRow?: (event: any) => void
    onEscapeDown?: () => void
    onEditingStart?: (event: any) => void
    onSelectionChanged?: (event: any) => Promise<void>
    onEditorPreparing?: (event: any) => void
    onRowClick?: (event: any) => void
    onRowDblClick?: (event: any) => void
    onRowPrepared?: (event: any) => void
    onCellPrepared?: (event: any) => void
    onContentReady?: (event: any) => void
    onCellClick?: (event: any) => void
    onSaving?: (event: any) => void
    onRowRemoving?: (event: any) => void
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
