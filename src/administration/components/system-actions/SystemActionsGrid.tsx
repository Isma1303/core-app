import { useEffect, useState } from 'react'
import { SystemAction } from '../../interfaces'
import { SystemActionsService } from '../../services'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Box } from 'lucide-react'

const systemActionsService = new SystemActionsService()
export const SystemActionsGrid = (): JSX.Element => {
    return (
        <div className="w-full space-y-3">
            <h2 className="content-block">Acciones del Sistema</h2>
            <div className="dx-card p-4">
                <p className="mb-3 text-sm text-muted-foreground">Grid de Acciones del Sistema eliminado. Listo para shadcn/ui.</p>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Acción</TableHead>
                            <TableHead>Descripción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2} className="py-10 text-center text-muted-foreground">
                                <div className="mx-auto flex w-fit items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2">
                                    <Box className="h-4 w-4" />
                                    Tabla de Acciones - Pendiente migración
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
