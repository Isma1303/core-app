import { useSaleStatusDataGridConfig } from '@/coffee/hooks/useSaleStatusDataGridConfig'
import { ISaleStatus } from '@/coffee/interfaces/sale_status.interface'
import { SaleStatusService } from '@/coffee/services/sale_status.service'
import { Button } from '@/components/ui/button'
import { customStoreBuilder } from '@/shared/builders/custom-store-builder.builder'
import { ScpGrid } from '@/shared/components'
import { ScpGridConfig } from '@/shared/interfaces'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export const SaleStatus = () => {
    const navigate = useNavigate()
    const service = new SaleStatusService()
    const { obtenerConfig } = useSaleStatusDataGridConfig(service)

    const saleStatusCustomStore = customStoreBuilder<ISaleStatus>(service, 'sale_status_id')
    const [saleStatusConfig, setSaleStatusConfig] = useState<ScpGridConfig | null>(null)

    useEffect(() => {
        obtenerConfig(saleStatusCustomStore).then((config) => {
            setSaleStatusConfig(config)
        })
    }, [])

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">Estados de Venta</h2>
                    <p className="text-muted-foreground text-sm">Administra los estados de venta del sistema.</p>
                </div>
                <Button variant="outline" onClick={() => navigate('/catalogs')}>
                    <i className="bi bi-arrow-left mr-2" />
                    Volver
                </Button>
            </div>

            <div className="px-4 pb-8">{saleStatusConfig && <ScpGrid configuration={saleStatusConfig!} />}</div>
        </div>
    )
}
