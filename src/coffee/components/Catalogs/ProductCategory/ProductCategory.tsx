import { useProductsCategoryDataGridConfig } from '@/coffee/hooks/useProductsCategoryDataGridConfig'
import { IProductCategories } from '@/coffee/interfaces/product_categories.interface'
import { ProductCategoriesService } from '@/coffee/services/product_category.service'
import { Button } from '@/components/ui/button'
import { customStoreBuilder } from '@/shared/builders/custom-store-builder.builder'
import { ScpGrid } from '@/shared/components'
import { ScpGridConfig } from '@/shared/interfaces'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export const ProductCategory = () => {
    const navigate = useNavigate()
    const service = new ProductCategoriesService()
    const { obtenerConfig } = useProductsCategoryDataGridConfig(service)

    const rolesCustomStore = customStoreBuilder<IProductCategories>(service, 'product_category_id')
    const [productCategoriesConfig, setProductCategoriesConfig] = useState<ScpGridConfig | null>(null)

    useEffect(() => {
        obtenerConfig(rolesCustomStore).then((config) => {
            setProductCategoriesConfig(config)
        })
    }, [])

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Categorias de Productos</h2>
                    <p className="text-muted-foreground text-sm">Administra las categorias de productos del sistema.</p>
                </div>
                <Button variant="outline" onClick={() => navigate('/catalogs')}>
                    <i className="bi bi-arrow-left mr-2" />
                    Volver
                </Button>
            </div>

            <div className="px-4 pb-8">{productCategoriesConfig && <ScpGrid configuration={productCategoriesConfig!} />}</div>
        </div>
    )
}
