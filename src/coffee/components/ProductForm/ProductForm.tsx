import { useState, useEffect } from 'react'
import { Stepper } from '@/shared/components/stepper/Stepper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileUpload } from '@/shared/components/file-upload/FileUpload'
import { ProductCategoriesService } from '@/coffee/services/product_category.service'
import { IProductCategories } from '@/coffee/interfaces/product_categories.interface'
import { IProduct, IProductNew } from '@/coffee/interfaces/product.interface'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface Props {
    onClose: () => void
    onSave: (product: IProductNew, image?: File) => Promise<void>
    initialData?: IProduct
}

export const ProductForm = ({ onClose, onSave, initialData }: Props) => {
    const isEditing = Boolean(initialData)

    const [activeStep, setActiveStep] = useState(1)
    const [categories, setCategories] = useState<IProductCategories[]>([])
    const [loadingCategories, setLoadingCategories] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const [formData, setFormData] = useState<IProductNew>({
        product_category_id: initialData?.product_category_id ?? 0,
        product_nm: initialData?.product_nm ?? '',
        product_description: initialData?.product_description ?? '',
        product_price: initialData?.product_price ?? 0,
        stock: initialData?.stock ?? 0,
        is_active: initialData?.is_active ?? true,
    })
    const [productImage, setProductImage] = useState<File | undefined>(undefined)

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const service = new ProductCategoriesService()
                const data = await service.getRecords(0, 100)
                setCategories(data)
            } catch (error) {
                toast.error('Error al cargar categorías')
            } finally {
                setLoadingCategories(false)
            }
        }
        loadCategories()
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }))
    }

    const handleCategoryChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            product_category_id: Number(value),
        }))
    }

    const nextStep = () => {
        if (activeStep === 1) {
            if (!formData.product_nm || !formData.product_category_id || formData.product_price <= 0) {
                return toast.error('Por favor complete los campos obligatorios')
            }
        }
        setActiveStep((prev) => prev + 1)
    }

    const prevStep = () => setActiveStep((prev) => prev - 1)

    const handleFileProcessed = async (file: File) => {
        setProductImage(file)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await onSave(formData, productImage)
            toast.success(isEditing ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente')
            onClose()
        } catch (error: any) {
            toast.error(error.message || 'Error al guardar el producto')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="bg-card p-6 rounded-xl border shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-semibold">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                    <p className="text-sm text-muted-foreground">
                        {isEditing ? 'Actualice los datos del producto.' : 'Siga los pasos para registrar un nuevo producto.'}
                    </p>
                </div>
                <Button variant="ghost" onClick={onClose}>
                    Cancelar
                </Button>
            </div>

            <Stepper activeStep={activeStep} totalSteps={2} className="mb-10 max-w-md mx-auto" />

            <div className="min-h-[300px]">
                {activeStep === 1 ? (
                    <div className="grid gap-6 py-4 max-w-2xl mx-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="product_nm">Nombre del Producto *</Label>
                                <Input
                                    id="product_nm"
                                    name="product_nm"
                                    value={formData.product_nm}
                                    onChange={handleInputChange}
                                    placeholder="Ej. Café Americano"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="product_category_id">Categoría *</Label>
                                <Select
                                    onValueChange={handleCategoryChange}
                                    value={formData.product_category_id ? formData.product_category_id.toString() : ''}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={loadingCategories ? 'Cargando...' : 'Seleccione una categoría'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.product_category_id} value={cat.product_category_id.toString()}>
                                                {cat.product_category_nm}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="product_description">Descripción</Label>
                            <Input
                                id="product_description"
                                name="product_description"
                                value={formData.product_description}
                                onChange={handleInputChange}
                                placeholder="Breve descripción del producto"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="product_price">Precio *</Label>
                                <Input
                                    id="product_price"
                                    name="product_price"
                                    type="number"
                                    step="0.01"
                                    value={formData.product_price}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Inicial</Label>
                                <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-4 max-w-md mx-auto space-y-4">
                        <div className="text-center mb-4">
                            <Label className="text-base">Imagen del Producto</Label>
                            <p className="text-sm text-muted-foreground">
                                {isEditing ? 'Sube una nueva imagen para reemplazar la actual.' : 'Sube una imagen representativa para el catálogo.'}
                            </p>
                        </div>

                        {/* Imagen actual al editar */}
                        {isEditing && initialData?.product_img && !productImage && (
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                                <img
                                    src={initialData.product_img}
                                    alt={initialData.product_nm}
                                    className="size-14 rounded object-cover border border-border/50"
                                />
                                <div>
                                    <p className="text-xs font-medium text-foreground">Imagen actual</p>
                                    <p className="text-[11px] text-muted-foreground">Sube otra para reemplazarla</p>
                                </div>
                            </div>
                        )}

                        <FileUpload onFileProcessed={handleFileProcessed} accept="jpg, jpeg, png, webp" acceptLabel="imágenes (jpg, png, webp)" />

                        {productImage && (
                            <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg border border-primary/20">
                                <div className="size-10 bg-primary/20 rounded flex items-center justify-center overflow-hidden">
                                    <img src={URL.createObjectURL(productImage)} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-medium truncate">{productImage.name}</p>
                                    <p className="text-[10px] text-muted-foreground">{(productImage.size / 1024).toFixed(2)} KB</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t">
                <Button variant="outline" onClick={prevStep} disabled={activeStep === 1 || isSaving}>
                    Anterior
                </Button>
                {activeStep === 1 ? (
                    <Button onClick={nextStep}>Siguiente</Button>
                ) : (
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? 'Actualizar Producto' : 'Guardar Producto'}
                    </Button>
                )}
            </div>
        </div>
    )
}
