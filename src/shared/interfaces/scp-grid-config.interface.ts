import { ScpGridColumn } from './scp-grid-column.interface'
import { ScpGridToolbarButton } from './scp-grid-toolbar-button.interface'

export interface ScpGridConfig {
    dataSource: any
    dataId: string
    columns: ScpGridColumn[]
    pageRecords?: number[]
    showSearch?: boolean
    showFilters?: boolean
    allowUpdate?: boolean
    allowDelete?: boolean
    allowCreate?: boolean
    customAdd?: boolean
    customButtons?: ScpGridToolbarButton[]
    customButtonClicked?: (buttonName: string) => Promise<void> | void
    onEditClick?: (record: Record<string, any>) => void
    onDeleteClick?: (record: Record<string, any>) => void
    fileName?: string
    margin?: string
    [key: string]: any
}
