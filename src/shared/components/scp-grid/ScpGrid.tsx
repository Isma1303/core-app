import DataGrid, {
    ColumnChooser,
    DataGridRef,
    Editing,
    FilterRow,
    Grouping,
    GroupPanel,
    Item,
    Pager,
    Paging,
    Scrolling,
    SearchPanel,
    Selection,
    Toolbar,
} from 'devextreme-react/data-grid'
import './scpGrid.scss'
import { useDataGrid } from '../../hooks'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Button } from 'devextreme-react'
import { ScpGridActionsProps, ScpGridConfig, ScpGridEmitsEvents, ScpGridProps, ScpGridToolbarButton } from '../../interfaces'

export const ScpGrid = forwardRef((props: ScpGridProps & ScpGridActionsProps & ScpGridEmitsEvents, ref): JSX.Element => {
    const { configuration } = props

    const [configurationState, setConfigurationState] = useState<ScpGridConfig>(configuration)

    const dataGrid = useRef<DataGridRef>(null)

    useEffect(() => {
        if (!configurationState.buttonsInLastColumn) moveButtonsToStart()
    }, [])

    const moveButtonsToStart = (): void => {
        if (configurationState.columns.some((column) => column.type === 'buttons')) return

        setConfigurationState((prevState) => {
            const newState = { ...prevState }
            newState.columns = [...newState.columns]
            if (newState.columns.some((column) => column.type === 'buttons')) return newState
            newState.columns.unshift({
                type: 'buttons',
                caption: 'Acciones',
            })
            return newState
        })
    }

    const {
        onRowExpanded,
        onInitNewRow,
        onSelectionChanged,
        onRowInserted,
        onRowUpdated,
        onEditorPreparingLocal,
        onRowPrepared,
        onRowDblClick,
        onRowClick,
        onRowRemoving,
        onKeyDown,
        onEditingStart,
        onCellPrepared,
        onContentReady,
        onCellClick,
        onSaving,
        getSelectedData,
        getSelectedDataDelete,
        exportGridToPDF,
        exportGridToXLSX,
        refreshDataGrid,
    } = useDataGrid({
        dataGrid,
        configuration,
        onDetailsFilter: props.onDetailsFilter,
        onInitNewRow: props.onInitNewRow,
        onSelectionChanged: props.onSelectionChanged,
        onEditorPreparing: props.onEditorPreparing,
        onRowClick: props.onRowClick,
        onRowRemoving: props.onRowRemoving,
        informationRow: props.informationRow,
        selectionChange: props.selectionChange,
        rowDataUpdated: props.rowDataUpdated,
        onEscapeDown: props.onEscapeDown,
        onEditingStart: props.onEditingStart,
        onCellPrepared: props.onCellPrepared,
        onContentReady: props.onContentReady,
        onRowPrepared: props.onRowPrepared,
        onCellClick: props.onCellClick,
        onSaving: props.onSaving,
        getSelectedDataEvent: props.getSelectedDataEvent,
        getSelectedDataEventDelete: props.getSelectedDataEventDelete,
    })

    //Properties or methods you want to expose at the parent component
    useImperativeHandle(ref, () => ({
        dataGrid,
        instanceDataGrid: dataGrid.current?.instance(),
        refreshDataGrid,
    }))

    return (
        <DataGrid
            ref={dataGrid}
            disabled={props.disabled}
            className={`dx-card ${configuration.margin || 'mx-0'}`}
            allowColumnReordering={configuration.allowReordering || false}
            dataSource={configuration.dataSource}
            columns={configurationState.columns || []}
            showBorders={configuration.showBorders || false}
            repaintChangesOnly={true}
            rowAlternationEnabled={configuration.showAlternateRowShading || false}
            showColumnLines={true}
            columnAutoWidth={true}
            summary={configuration.footer}
            remoteOperations={configuration.remoteOperations || 'auto'}
            wordWrapEnabled={configuration.wordWrapEnabled || false}
            loadPanel={{
                enabled: true,
                showIndicator: true,
            }}
            allowColumnResizing={configuration.allowColumnSelection || true}
            width={configuration.width || '100%'}
            onRowExpanded={onRowExpanded}
            onInitNewRow={onInitNewRow}
            onSelectionChanged={onSelectionChanged}
            onRowInserted={onRowInserted}
            onRowUpdated={onRowUpdated}
            onEditorPreparing={onEditorPreparingLocal}
            onRowPrepared={onRowPrepared}
            onRowClick={onRowClick}
            onRowDblClick={onRowDblClick}
            onKeyDown={onKeyDown}
            onEditingStart={onEditingStart}
            onCellPrepared={onCellPrepared}
            onContentReady={onContentReady}
            onCellClick={onCellClick}
            onSaving={onSaving}
            onRowRemoving={onRowRemoving}
        >
            {configuration.editSelection && (
                <Selection
                    selectAllMode="allPages"
                    showCheckBoxesMode="onClick"
                    mode={configuration.selectionMode || 'multiple'}
                    deferred={configuration.deferredLoading || false}
                />
            )}

            {configuration.enableMultipleSelection && (
                <Selection selectAllMode="allPages" showCheckBoxesMode="onClick" mode={configuration.selectionMode || 'single'} />
            )}

            <ColumnChooser enabled={configuration.allowColumnSelection || false} mode={configuration.columnChooserType || 'select'} />
            <SearchPanel visible={configuration.showSearch || false} width={configuration.searchLength || 240} placeholder="Buscar..." />
            <FilterRow visible={configuration.showFilters} />
            <Editing
                mode={configuration.editMode || 'row'}
                allowAdding={configuration.allowCreate || false}
                allowUpdating={configuration.allowUpdate || false}
                allowDeleting={configuration.allowDelete || false}
                confirmDelete={true}
                refreshMode="full"
            />
            <GroupPanel visible={configuration.showGrouping || false} />

            <Toolbar>
                <Item name="groupPanel" />
                <Item name="addRowButton" />
                <Item name="saveButton" />
                {(configuration.customAdd || false) && (
                    <Item>
                        <Button
                            icon="add"
                            hint="Agregar registro"
                            onClick={() => {
                                if (props.addRow) props.addRow(true)
                            }}
                        ></Button>
                    </Item>
                )}
                {(configuration.editSelection || false) && (
                    <Item location="after">
                        <Button
                            icon="edit"
                            hint="Editar por Selección"
                            onClick={() => {
                                getSelectedData()
                            }}
                        ></Button>
                    </Item>
                )}

                {(configuration.deleteSelection || false) && (
                    <Item>
                        <Button
                            icon="trash"
                            hint="Eliminar por Selección"
                            onClick={() => {
                                getSelectedDataDelete()
                            }}
                        ></Button>
                    </Item>
                )}

                {configuration.customButtons?.map((button: ScpGridToolbarButton) => (
                    <Item key={button.name}>
                        <Button
                            icon={button.icon}
                            hint={button.hint}
                            onClick={() => {
                                if (props.customButtonClicked) props.customButtonClicked(button.name)
                            }}
                        ></Button>
                    </Item>
                ))}
                <Item name="revertButton" />
                <Item name="columnChooserButton" />

                <Item location="after">
                    <Button
                        icon="refresh"
                        hint="Refrescar Grid"
                        onClick={() => {
                            if (refreshDataGrid) refreshDataGrid()
                        }}
                    ></Button>
                </Item>

                {configuration.enableBatchLoading && (
                    <Item>
                        <Button
                            icon="iserttable"
                            hint="Carga de datos en Batch"
                            onClick={() => {
                                if (props.sendBatchLoad) props.sendBatchLoad(true)
                            }}
                        ></Button>
                    </Item>
                )}

                {configuration.allowExportPDF && (
                    <Item location="after">
                        <Button
                            icon="exportpdf"
                            hint="Exportar a PDF"
                            onClick={() => {
                                exportGridToPDF()
                            }}
                        ></Button>
                    </Item>
                )}

                {configuration.allowExportExcel && (
                    <Item location="after">
                        <Button
                            icon="exportxlsx"
                            hint="Exportar a Excel"
                            onClick={() => {
                                exportGridToXLSX()
                            }}
                        ></Button>
                    </Item>
                )}
            </Toolbar>
            <Scrolling rowRenderingMode="virtual"></Scrolling>
            <Paging defaultPageSize={configuration.defaultPageRecords || 10} />
            <Pager
                visible={true}
                allowedPageSizes={configuration.pageRecords || [5, 10, 20]}
                displayMode="full"
                showPageSizeSelector={true}
                showInfo={true}
                showNavigationButtons={true}
            />

            <Grouping autoExpandAll={configuration.autoExpandAllGroups || false} />
        </DataGrid>
    )
})
