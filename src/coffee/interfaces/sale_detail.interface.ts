export interface ISaleDetail {
    sale_detail_id: number
    sale_id: number
    product_id: number
    quantity: number
    line_total: number
}

export interface ISaleDetailNew extends Omit<ISaleDetail, 'sale_detail_id'> {}
export interface ISaleDetailUpdate extends Partial<ISaleDetail> {}
