export interface IProductCategories {
    product_category_id: number
    product_category_nm: string
}

export interface IProductCategoriesNew extends Omit<IProductCategories, 'product_category_id'> {}
export interface IProductCategoriesUpdate extends Partial<IProductCategories> {}
