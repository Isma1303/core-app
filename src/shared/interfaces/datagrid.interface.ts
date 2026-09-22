import { DataGridConfig } from './datagrid-config.interface'

export interface DataGridProps {
    configuration: DataGridConfig
    gridRef?: React.RefObject<any>
}