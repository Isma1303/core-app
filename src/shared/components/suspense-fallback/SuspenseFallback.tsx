import './SuspenseFallback.css'
import { LoaderCircle } from 'lucide-react'

export const SuspenseFallback = (): JSX.Element => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
                <LoaderCircle className="h-4 w-4 animate-spin text-foreground" />
                Cargando contenido
            </div>
        </div>
    )
}
