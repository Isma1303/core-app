import React from 'react'
import { User, Settings, Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const IconDemo = () => {
    return (
        <div className="mx-auto max-w-6xl space-y-6 p-6">
            <h1 className="text-3xl font-bold tracking-tight">Integration Demo</h1>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <div className="card bg-card p-4 text-card-foreground">
                        <div>
                            <h5 className="mb-3 flex items-center gap-2 font-semibold">
                                <User className="w-5 h-5 text-primary" />
                                Bootstrap Card with Lucide
                            </h5>
                            <p className="mb-4 text-muted-foreground">
                                This card uses Bootstrap classes (<code className="bg-muted px-1 rounded">card</code>,{' '}
                                <code className="bg-muted px-1 rounded">row</code>, <code className="bg-muted px-1 rounded">col</code>) but is styled
                                with Shadcn variables and uses Lucide Icons.
                            </p>
                            <div className="flex gap-2">
                                <Button variant="default" className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Shadcn Button
                                </Button>
                                <button className="btn btn-outline-secondary flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Bootstrap Button
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="p-4 rounded-lg border bg-accent/10 border-accent/20">
                        <h5 className="mb-3 flex items-center gap-2 font-semibold">
                            <Bell className="w-5 h-5 text-accent" />
                            Notifications (Tailwind + Lucide)
                        </h5>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 p-2 rounded hover:bg-accent/20 transition-colors">
                                <Info className="w-4 h-4 text-blue-500" />
                                <span>System update available</span>
                            </li>
                            <li className="flex items-center gap-3 p-2 rounded hover:bg-accent/20 transition-colors">
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                <span>Low disk space warning</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="alert flex items-center gap-2" role="alert">
                <Info className="h-5 w-5" />
                <div>
                    This is a standard <strong>Bootstrap Alert</strong> enhanced with a <strong>Lucide Icon</strong>.
                </div>
            </div>
        </div>
    )
}

export default IconDemo
