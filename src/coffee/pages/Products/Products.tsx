import { useEffect, useState, useMemo } from 'react'
import { customStoreBuilder } from '@/shared/builders/custom-store-builder.builder'
import { ScpGridConfig } from '@/shared/interfaces/scp-grid-config.interface'
import { IProduct, IProductNew } from '@/coffee/interfaces/product.interface'
import { ScpGrid } from '@/shared/components'
import { ProductsService } from '@/coffee/services/products.service'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ProductForm } from '../../components/ProductForm/ProductForm'
import { useProductsDataGridConfig } from '@/coffee/hooks/useProductsDataGridConfig'

export const Products = (): JSX.Element => {
    const productService = useMemo(() => new ProductsService(), [])

    const { obtenerConfig } = useProductsDataGridConfig(productService)

    const [productsConfiguration, setProductsConfiguration] = useState<ScpGridConfig | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null)

    const isFormVisible = showForm || editingProduct !== null

    const loadGridConfig = async () => {
        const productsCustomStore = customStoreBuilder<IProduct>(productService, 'product_id')
        const config = await obtenerConfig(productsCustomStore)

        config.onEditClick = (row: Record<string, any>) => {
            setEditingProduct(row as IProduct)
        }

        config.onDeleteClick = (row: Record<string, any>) => {
            const product = row as IProduct
            handleDeleteProduct(product.product_id, product.public_id || '')
        }

        setProductsConfiguration(config)
    }

    useEffect(() => {
        if (!isFormVisible && !productsConfiguration) {
            loadGridConfig()
        }
    }, [isFormVisible, productsConfiguration])

    const buildFormData = (product: IProductNew, image?: File): FormData => {
        const formData = new FormData()
        Object.entries(product).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value))
            }
        })
        if (image) formData.append('image', image)
        return formData
    }

    const handleSaveProduct = async (product: IProductNew, image?: File) => {
        const formData = buildFormData(product, image)
        await productService.createProduct(formData)
        closeForm()
    }

    const handleUpdateProduct = async (product: IProductNew, image?: File) => {
        if (!editingProduct) return
        const formData = buildFormData(product, image)
        await productService.updateProduct(editingProduct.product_id, formData)
        closeForm()
    }

    const handleDeleteProduct = async (product_id: number, product_img: string) => {
        await productService.deleteProductImage(product_id, { product_img })
        closeForm()
    }

    const closeForm = () => {
        setShowForm(false)
        setEditingProduct(null)
        setProductsConfiguration(null)
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Productos</h2>
                    <p className="text-muted-foreground text-sm">Gestiona el inventario de productos y sus categorías.</p>
                </div>
                {!isFormVisible && (
                    <Button onClick={() => setShowForm(true)} className="gap-2">
                        <Plus className="size-4" />
                        Nuevo Producto
                    </Button>
                )}
            </div>

            <div className="px-4 pb-8">
                {isFormVisible ? (
                    editingProduct ? (
                        <ProductForm onClose={closeForm} onSave={handleUpdateProduct} initialData={editingProduct} />
                    ) : (
                        <ProductForm onClose={closeForm} onSave={handleSaveProduct} />
                    )
                ) : (
                    productsConfiguration && <ScpGrid configuration={productsConfiguration} />
                )}
            </div>
        </div>
    )
}
