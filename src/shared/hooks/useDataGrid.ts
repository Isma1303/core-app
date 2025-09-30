/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import DevExpress from 'devextreme'
import {
    CellClickEvent,
    CellPreparedEvent,
    ContentReadyEvent,
    EditorPreparingEvent,
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
import { ScpDataGridActions, ScpDataGridProps, ScpGridColumn, UseDataGridEventsEmits } from '../interfaces'

import { jsPDF } from 'jspdf'
import { exportDataGrid as exportDataGridPDF } from 'devextreme/pdf_exporter'
import { exportDataGrid as exportDataGridXLSX } from 'devextreme/excel_exporter'
import { Workbook } from 'exceljs'
import { saveAs } from 'file-saver'
import { DataGridTypes } from 'devextreme-react/cjs/data-grid'

export const useDataGrid = (scpDataGridProps: ScpDataGridProps & UseDataGridEventsEmits): ScpDataGridActions => {
    const onRowExpanded = (event: RowExpandedEvent<DevExpress.common.GroupItem<any>, any>): void => {
        if (scpDataGridProps.onDetailsFilter) scpDataGridProps.onDetailsFilter(event.key)
    }

    const onInitNewRow = (event: any): void => {
        scpDataGridProps.configuration.columns.forEach((field: ScpGridColumn) => {
            if (typeof field.default == 'undefined' || typeof field.dataField == 'undefined') return
            if (field.lookup) return
            if (typeof field.default == 'function') event.data[field.dataField] = field.default(event)
            else event.data[field.dataField] = field.default
        })
        if (scpDataGridProps.newInitializedRow) scpDataGridProps.newInitializedRow(event)
    }

    const onSelectionChanged = async (event: DataGridTypes.SelectionChangedEvent): Promise<void> => {
        if (scpDataGridProps.configuration.deferredLoading && !scpDataGridProps.configuration.noRowDataOnDeferredLoad) {
            if (scpDataGridProps.informationRow) scpDataGridProps.informationRow(event.selectedRowsData)
            if (scpDataGridProps.selectionChange) scpDataGridProps.selectionChange(await event.component.getSelectedRowKeys())
        } else {
            if (scpDataGridProps.informationRow) scpDataGridProps.informationRow(await event.selectedRowsData)
            if (scpDataGridProps.selectionChange) scpDataGridProps.selectionChange(await event.selectedRowKeys)
        }
    }

    const onRowInserted = (event: RowInsertedEvent<DevExpress.common.GroupItem<any>, any>): void => {
        if (scpDataGridProps.rowDataUpdated) scpDataGridProps.rowDataUpdated(true)
    }

    const onRowUpdated = (event: RowUpdatedEvent<DevExpress.common.GroupItem<any>, any>): void => {
        if (scpDataGridProps.rowDataUpdated) scpDataGridProps.rowDataUpdated(true)
    }

    const onEditorPreparingLocal = (options: EditorPreparingEvent<DevExpress.common.GroupItem<any>, any>): void => {
        scpDataGridProps.configuration.columns.forEach((column: ScpGridColumn) => {
            if (typeof column.default !== 'function') return
            if (column.lookup) {
                column.default(options)
            }
        })
        if (scpDataGridProps.onEditorPreparing) {
            scpDataGridProps.onEditorPreparing(options)
        } else {
            onEditorPreparing(options)
        }
    }

    const onEditorPreparing = (options: EditorPreparingEvent<DevExpress.common.GroupItem<any>, any>): void => {}

    const onKeyDown = (event: KeyDownEvent<DevExpress.common.GroupItem<any>, any>): void => {
        if (event?.event?.code === 'Escape') {
            scpDataGridProps.dataGrid.current?.instance().deselectAll()
            if (scpDataGridProps.onEscapeDown) scpDataGridProps.onEscapeDown()
        }
    }

    const onRowClick = (event: RowClickEvent<DevExpress.common.GroupItem<any>, any>): void => {}
    const onRowDblClick = (event: RowDblClickEvent<DevExpress.common.GroupItem<any>, any>): void => {}
    const onRowPrepared = (event: RowPreparedEvent<DevExpress.common.GroupItem<any>, any>): void => {}
    const onCellPrepared = (event: CellPreparedEvent<DevExpress.common.GroupItem<any>, any>): void => {}
    const onContentReady = (event: ContentReadyEvent<DevExpress.common.GroupItem<any>, any>): void => {}
    const onCellClick = (event: CellClickEvent<DevExpress.common.GroupItem<any>, any>): void => {}
    const onSaving = (event: SavingEvent<DevExpress.common.GroupItem<any>, any>): void => {}
    const onRowRemoving = (event: RowRemovingEvent<DevExpress.common.GroupItem<any>, any>): void => {}

    const getSelectedData = async (): Promise<void> => {
        const keys = await scpDataGridProps.dataGrid.current?.instance().getSelectedRowKeys()
        const firstRow = await scpDataGridProps.dataGrid.current
            ?.instance()
            .getSelectedRowsData()
            .then((data) => {
                return data[0]
            })
        if (scpDataGridProps.getSelectedDataEvent)
            scpDataGridProps.getSelectedDataEvent({
                keys: keys,
                record: firstRow,
            })
    }

    const getSelectedDataDelete = async (): Promise<void> => {
        const keys = await scpDataGridProps.dataGrid.current?.instance().instance().getSelectedRowKeys()
        const firstRow = await scpDataGridProps.dataGrid.current
            ?.instance()
            .instance()
            .getSelectedRowsData()
            .then((dato) => {
                return dato[0]
            })
        if (scpDataGridProps.getSelectedDataEventDelete)
            scpDataGridProps.getSelectedDataEventDelete({
                keys: keys,
                record: firstRow,
            })
    }

    const exportGridToPDF = (): void => {
        const doc = new jsPDF()
        exportDataGridPDF({
            jsPDFDocument: doc,
            component: scpDataGridProps.dataGrid.current!.instance(),
        }).then(() => {
            doc.save(`${scpDataGridProps.configuration.fileName || ''}-PDF.pdf`)
        })
    }

    const exportGridToXLSX = (): void => {
        const workBook = new Workbook()
        const sheet = workBook.addWorksheet(`Hoja ${scpDataGridProps.configuration.fileName || ''}`)
        exportDataGridXLSX({
            component: scpDataGridProps.dataGrid.current!.instance(),
            worksheet: sheet,
        }).then(() => {
            workBook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${scpDataGridProps.configuration.fileName || ''}.xlsx`)
            })
        })
    }

    const refreshDataGrid = (): void => {
        scpDataGridProps.dataGrid.current?.instance().refresh()
    }

    return {
        onRowExpanded,
        onInitNewRow: scpDataGridProps.onInitNewRow ? scpDataGridProps.onInitNewRow : onInitNewRow,
        onSelectionChanged: scpDataGridProps.onSelectionChanged ? scpDataGridProps.onSelectionChanged : onSelectionChanged,
        onRowInserted,
        onRowUpdated,
        onEditorPreparingLocal,
        onEditorPreparing: scpDataGridProps.onEditorPreparing ? scpDataGridProps.onEditorPreparing : onEditorPreparing,
        onKeyDown,
        onEditingStart: scpDataGridProps.onEditingStart,
        onRowClick: scpDataGridProps.onRowClick ? scpDataGridProps.onRowClick : onRowClick,
        onRowDblClick: scpDataGridProps.onRowDblClick ? scpDataGridProps.onRowDblClick : onRowDblClick,
        onRowPrepared: scpDataGridProps.onRowPrepared ? scpDataGridProps.onRowPrepared : onRowPrepared,
        onCellPrepared: scpDataGridProps.onCellPrepared ? scpDataGridProps.onCellPrepared : onCellPrepared,
        onContentReady: scpDataGridProps.onContentReady ? scpDataGridProps.onContentReady : onContentReady,
        onCellClick: scpDataGridProps.onCellClick ? scpDataGridProps.onCellClick : onCellClick,
        onSaving: scpDataGridProps.onSaving ? scpDataGridProps.onSaving : onSaving,
        getSelectedData,
        getSelectedDataDelete,
        exportGridToPDF,
        exportGridToXLSX,
        refreshDataGrid,
        onRowRemoving,
    }
}
