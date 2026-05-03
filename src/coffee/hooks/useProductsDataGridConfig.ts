import { createElement } from 'react'
import { DataService, ScpGridConfig } from '@/shared/interfaces'
import { IProduct } from '../interfaces/product.interface'
import { useAuthStore } from '@/auth'
import { ProductCategoriesService } from '../services/product_category.service'
import { buildLookpDataSource } from '@/shared/utils'

export const useProductsDataGridConfig = (service: DataService<IProduct>) => {
    const userInfo = useAuthStore((state) => state.userInfo)

    const obtenerConfig = async (dataSource: any): Promise<any> => {
        const productCategorieService = new ProductCategoriesService()
        const productCategoryCustomStore = buildLookpDataSource(productCategorieService)

        const modelProperties = await service.getModelProperties()
        const table = modelProperties?.tableName.toUpperCase()
        const config: ScpGridConfig = {
            dataSource: dataSource,
            dataId: 'product_id',
            columns: [
                {
                    dataField: 'product_category_id',
                    caption: 'Categoría',
                    lookup: {
                        dataSource: productCategoryCustomStore,
                        valueExpr: 'product_category_id',
                        displayExpr: 'product_category_nm',
                    },
                    allowFiltering: true,
                },
                {
                    dataField: 'product_nm',
                    caption: 'Nombre',
                    allowFiltering: true,
                },
                {
                    dataField: 'product_description',
                    caption: 'Descripción',
                    allowFiltering: true,
                },
                {
                    dataField: 'product_price',
                    caption: 'Precio',
                    allowFiltering: true,
                },
                {
                    dataField: 'stock',
                    caption: 'Stock',
                    allowFiltering: true,
                },
                {
                    dataField: 'is_active',
                    caption: 'Estado',
                    lookup: {
                        dataSource: [
                            { value: true, text: 'Activo' },
                            { value: false, text: 'Inactivo' },
                        ],
                        valueExpr: 'value',
                        displayExpr: 'text',
                    },
                    allowFiltering: true,
                },
                {
                    dataField: 'product_img',
                    caption: 'Imagen',
                    allowFiltering: false,
                    cellTemplate: (row) => {
                        const imgUrl = row.product_img
                        if (!imgUrl)
                            return createElement('span', { className: 'text-xs text-muted-foreground italic' }, 'Sin imagen')

                        return createElement('img', {
                            src: imgUrl,
                            alt: row.product_nm ?? 'Producto',
                            className: 'size-10 rounded object-cover border border-border/50',
                        })
                    },
                },
            ],
            showBorders: true,
            showSearch: true,
            showFilters: true,
            allowReordering: true,
            allowColumnSelection: true,
            pageRecords: [5, 10, 20],
            allowUpdate: false,
            allowDelete: false,
            allowCreate: false,
            allowExportPDF: true,
            fileName: 'Productos',
            allowExportExcel: true,
            remoteOperations: { grouping: false, filtering: true, paging: true },
            deferredLoading: false,
            buttonsInLastColumn: true,
            margin: 'mx-3',
            editMode: 'row',
        }

        if (!userInfo?.actions.hasOwnProperty(table!)) {
            config.dataSource = []
            return config
        }

        if (userInfo.actions[table!]) {
            config.allowUpdate = true
            config.allowDelete = true
            config.allowCreate = false
            config.buttonsInLastColumn = true
            return config
        }
        return config
    }

    return {
        obtenerConfig,
    }
}
