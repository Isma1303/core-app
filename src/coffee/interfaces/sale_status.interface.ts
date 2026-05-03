export interface ISaleStatus {
    sale_status_id: number
    sale_status_nm: string
}

export interface ISaleStatusNew extends Omit<ISaleStatus, 'sale_status_id'> {}
export interface ISaleStatusUpdate extends Partial<ISaleStatus> {}
