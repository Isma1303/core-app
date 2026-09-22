import { DataGridColumn } from './datagrid-column.interface'
import { DataGridToolbarButton } from './datagrid-toolbar-button.interface'

export interface DataGridConfig {
    dataSource: any
    dataId: string
    columns: DataGridColumn[]
    pageRecords?: number[]
    showSearch?: boolean
    showFilters?: boolean
    allowUpdate?: boolean
    allowDelete?: boolean
    allowCreate?: boolean
    customAdd?: boolean
    customButtons?: DataGridToolbarButton[]
    customButtonClicked?: (buttonName: string) => Promise<void> | void
    onEditClick?: (record: Record<string, any>) => void
    onDeleteClick?: (record: Record<string, any>) => void
    fileName?: string
    margin?: string
    [key: string]: any
}