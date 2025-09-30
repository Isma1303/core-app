import { DataGridTypes } from 'devextreme-react/cjs/data-grid'
import { PagerPageSize } from 'devextreme/common/grids'
import CustomStore from 'devextreme/data/custom_store'
import DataSource from 'devextreme/data/data_source'
import { ScpGridColumn } from './scp-grid-column.interface'
import { ScpGridToolbarButton } from './scp-grid-toolbar-button.interface'

export interface ScpGridConfig {
    dataSource: CustomStore | any[] | DataSource
    dataId: string
    columns: ScpGridColumn[]
    width?: string
    editMode?: DataGridTypes.GridsEditMode
    allowReordering?: boolean
    margin?: string
    showBorders?: boolean
    showFilters?: boolean
    showSearch?: boolean
    searchLength?: number
    allowColumnSelection?: boolean
    columnChooserType?: DataGridTypes.ColumnChooserMode
    pageRecords?: 'auto' | (number | PagerPageSize)[]
    allowCreate?: boolean
    allowUpdate?: boolean
    allowDelete?: boolean
    allowExportPDF?: boolean
    allowExportExcel?: boolean
    fileName?: string
    autoWidth?: boolean
    showDetails?: boolean
    autoExpand?: boolean
    footer?: any
    defaultPageRecords?: number
    showGrouping?: boolean
    editSelection?: boolean
    deleteSelection?: boolean
    buttonsInLastColumn?: boolean
    customButton?: boolean
    enableBatchLoading?: boolean
    remoteOperations?:
        | boolean
        | 'auto'
        | {
              filtering?: boolean | undefined
              grouping?: boolean | undefined
              groupPaging?: boolean | undefined
              paging?: boolean | undefined
              sorting?: boolean | undefined
              summary?: boolean | undefined
          }
    wordWrapEnabled?: boolean
    deferredLoading?: boolean
    customAdd?: boolean
    customEdit?: boolean
    customSaveButton?: boolean
    responsiveDetail?: boolean
    showAlternateRowShading?: boolean
    customButtons?: Array<ScpGridToolbarButton>
    enableMultipleSelection?: boolean
    selectionMode?: 'none' | 'single' | 'multiple' | undefined
    noRowDataOnDeferredLoad?: boolean
    selection?: boolean
    autoExpandAllGroups?: boolean
}
