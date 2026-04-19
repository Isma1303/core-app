import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ListTodo } from 'lucide-react'

export const TasksPage = (): JSX.Element => {
    return (
        <div className="space-y-4 p-4">
            <h2 className={'content-block'}>Tasks</h2>
            <div className={'dx-card wide-card p-4'}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>Due Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                                <div className="mx-auto flex w-fit items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2">
                                    <ListTodo className="h-4 w-4" />
                                    Componente Grid (DevExtreme) eliminado. Listo para migración a shadcn/ui.
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
