import React from 'react';
import { User, Settings, Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const IconDemo = () => {
    return (
        <div className="container py-5">
            <h1 className="mb-4 text-3xl font-bold">Integration Demo</h1>
            
            <div className="row mb-5">
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm border-0 bg-card text-card-foreground p-4 rounded-lg border">
                        <div className="card-body">
                            <h5 className="card-title flex items-center gap-2 font-semibold mb-3">
                                <User className="w-5 h-5 text-primary" />
                                Bootstrap Card with Lucide
                            </h5>
                            <p className="card-text text-muted-foreground mb-4">
                                This card uses Bootstrap classes (<code className="bg-muted px-1 rounded">card</code>, <code className="bg-muted px-1 rounded">row</code>, <code className="bg-muted px-1 rounded">col</code>) 
                                but is styled with Shadcn variables and uses Lucide Icons.
                            </p>
                            <div className="flex gap-2">
                                <Button variant="default" className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Shadcn Button
                                </Button>
                                <button className="btn btn-outline-primary flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Bootstrap Button
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="p-4 rounded-lg border bg-accent/10 border-accent/20">
                        <h5 className="flex items-center gap-2 font-semibold mb-3">
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

            <div className="alert alert-info d-flex align-items-center" role="alert">
                <Info className="w-5 h-5 me-2" />
                <div>
                    This is a standard <strong>Bootstrap Alert</strong> enhanced with a <strong>Lucide Icon</strong>.
                </div>
            </div>
        </div>
    );
};

export default IconDemo;
