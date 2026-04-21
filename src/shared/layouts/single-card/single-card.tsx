import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import './single-card.scss'

interface Props {
    title: string
    description?: string
    children?: JSX.Element | JSX.Element[]
}

export const SingleCard = ({ title, description, children }: Props): JSX.Element => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <Card className="flex flex-col items-center justify-center gap-6 p-8 border border-border rounded-xl shadow-lg bg-card w-full max-w-md transition-all animate-in fade-in zoom-in duration-500">
                <CardHeader className="text-center space-y-2 p-0">
                    <CardTitle className="text-3xl font-bold tracking-tight text-foreground">{title}</CardTitle>
                    {description && <CardDescription className="text-muted-foreground text-sm">{description}</CardDescription>}
                </CardHeader>
                <CardContent className="w-full p-0">
                    {children}
                </CardContent>
            </Card>
        </div>
    )
}
