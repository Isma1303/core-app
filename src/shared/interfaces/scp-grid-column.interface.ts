/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import DevExpress from 'devextreme'

export interface ScpGridColumn extends DevExpress.ui.dxDataGrid.Column<any, any> {
    default?: string | number | boolean | Function | Date
}
