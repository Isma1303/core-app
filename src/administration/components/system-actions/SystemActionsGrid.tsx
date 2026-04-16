import { useEffect, useState } from 'react'
import { SystemAction } from '../../interfaces'
import { SystemActionsService } from '../../services'

const systemActionsService = new SystemActionsService()
export const SystemActionsGrid = (): JSX.Element => {
    return (
        <div style={{ width: '100%' }}>
            <h2 className="content-block">Acciones del Sistema</h2>
            <div className="dx-card" style={{ padding: '1rem' }}>
                <p>Grid de Acciones del Sistema eliminado. Listo para shadcn/ui.</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th style={{ padding: '8px', textAlign: 'left' }}>Acción</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={2} style={{ textAlign: 'center', padding: '2rem' }}>
                                Tabla de Acciones - Pendiente migración
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
