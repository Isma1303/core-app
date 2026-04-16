export const TasksPage = (): JSX.Element => {
    return (
        <div style={{ padding: '1rem' }}>
            <h2 className={'content-block'}>Tasks</h2>
            <div className={'dx-card wide-card'} style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #ccc' }}>
                            <th style={{ textAlign: 'left', padding: '8px' }}>ID</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Subject</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Priority</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Assigned To</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Start Date</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                                Componente Grid (DevExtreme) eliminado. Listo para migración a shadcn/ui.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
