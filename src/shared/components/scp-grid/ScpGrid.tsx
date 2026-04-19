import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScpGridProps, ScpGridColumn } from '../../interfaces'
import { ArrowDownUp, Download, FileSpreadsheet, KeyRound, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { saveAs } from 'file-saver'

const DEFAULT_PAGE_SIZES = [5, 10, 20]

const normalizeText = (value: any): string =>
    String(value ?? '')
        .toLowerCase()
        .trim()

const formatValue = (row: Record<string, any>, column: ScpGridColumn): string => {
    const value = row[column.dataField]

    if (column.lookup && Array.isArray(column.lookup.dataSource) && column.lookup.valueExpr && column.lookup.displayExpr) {
        const lookupItem = column.lookup.dataSource.find((item) => item[column.lookup?.valueExpr as string] === value)
        if (lookupItem) return String(lookupItem[column.lookup.displayExpr])
    }

    if (typeof value === 'boolean') return value ? 'Si' : 'No'
    return String(value ?? '-')
}

export const ScpGrid = ({ configuration }: ScpGridProps): JSX.Element => {
    const columns = configuration.columns ?? []
    const pageRecords = configuration.pageRecords?.length ? configuration.pageRecords : DEFAULT_PAGE_SIZES

    const [rows, setRows] = useState<Record<string, any>[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(pageRecords[0])
    const [totalCount, setTotalCount] = useState(0)
    const [editingRow, setEditingRow] = useState<Record<string, any> | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [sortField, setSortField] = useState<string>(configuration.dataId)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})

    const isStoreLike = configuration.dataSource && typeof configuration.dataSource.load === 'function'
    const hasActions = Boolean(configuration.allowUpdate || configuration.allowDelete)

    const matchesColumnFilters = (row: Record<string, any>): boolean => {
        return columns.every((column: ScpGridColumn) => {
            const filterValue = normalizeText(columnFilters[column.dataField])
            if (!filterValue) return true

            const rowValue = normalizeText(formatValue(row, column))
            return rowValue.includes(filterValue)
        })
    }

    const fetchRows = async () => {
        setIsLoading(true)
        try {
            if (isStoreLike) {
                const result = await configuration.dataSource.load({
                    page,
                    pageSize,
                    searchText,
                    sortField,
                    sortDirection,
                })

                const sourceRows = result.data ?? []
                const filteredRows = sourceRows.filter(matchesColumnFilters)
                setRows(filteredRows)
                setTotalCount(result.totalCount ?? filteredRows.length)
            } else if (Array.isArray(configuration.dataSource)) {
                const source = configuration.dataSource

                const filteredBySearch = searchText
                    ? source.filter((row: Record<string, any>) =>
                          columns.some((column: ScpGridColumn) => normalizeText(row[column.dataField]).includes(normalizeText(searchText))),
                      )
                    : source

                const filtered = filteredBySearch.filter(matchesColumnFilters)

                const sorted = [...filtered].sort((a: Record<string, any>, b: Record<string, any>) => {
                    const first = normalizeText(a[sortField])
                    const second = normalizeText(b[sortField])

                    if (first === second) return 0
                    const comparison = first > second ? 1 : -1
                    return sortDirection === 'asc' ? comparison : -comparison
                })

                const offset = (page - 1) * pageSize
                setRows(sorted.slice(offset, offset + pageSize))
                setTotalCount(sorted.length)
            } else {
                setRows([])
                setTotalCount(0)
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRows()
    }, [page, pageSize, searchText, sortField, sortDirection, JSON.stringify(columnFilters)])

    const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / pageSize)), [totalCount, pageSize])

    const editableColumns = useMemo(
        () => columns.filter((column: ScpGridColumn) => column.dataField !== configuration.dataId),
        [columns, configuration.dataId],
    )

    const onDelete = async (row: Record<string, any>) => {
        if (!configuration.allowDelete || !isStoreLike) return
        const key = row[configuration.dataId]
        if (key === undefined) return

        await configuration.dataSource.remove(key)
        await fetchRows()
    }

    const onSave = async () => {
        if (!isStoreLike || !editingRow) return

        if (isCreating) {
            await configuration.dataSource.insert(editingRow)
        } else {
            const key = editingRow[configuration.dataId]
            if (key !== undefined) {
                await configuration.dataSource.update(key, editingRow)
            }
        }

        setEditingRow(null)
        setIsCreating(false)
        await fetchRows()
    }

    const onCreate = () => {
        const base: Record<string, any> = {}
        editableColumns.forEach((column: ScpGridColumn) => {
            base[column.dataField] = column.dataType === 'boolean' ? false : ''
        })
        setEditingRow(base)
        setIsCreating(true)
    }

    const toggleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
            return
        }

        setSortField(field)
        setSortDirection('asc')
    }

    const getCurrentRowsAsObjects = (): Record<string, any>[] => {
        return rows.map((row) => {
            const result: Record<string, any> = {}
            columns.forEach((column: ScpGridColumn) => {
                result[column.caption || column.dataField] = formatValue(row, column)
            })
            return result
        })
    }

    const exportToCsv = () => {
        const data = getCurrentRowsAsObjects()
        if (!data.length) return

        const headers = Object.keys(data[0])
        const lines = [
            headers.join(','),
            ...data.map((row) => headers.map((header) => `"${String(row[header] ?? '').replace(/"/g, '""')}"`).join(',')),
        ]

        const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
        saveAs(blob, `${configuration.fileName || 'grid-data'}.csv`)
    }

    const exportToXlsx = async () => {
        const data = getCurrentRowsAsObjects()
        if (!data.length) return

        const exceljs = await import('exceljs')
        const workbook = new exceljs.Workbook()
        const worksheet = workbook.addWorksheet(configuration.fileName || 'Datos')

        const headers = Object.keys(data[0])
        worksheet.addRow(headers)
        data.forEach((row) => {
            worksheet.addRow(headers.map((header) => row[header]))
        })

        const buffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        saveAs(blob, `${configuration.fileName || 'grid-data'}.xlsx`)
    }

    const getButtonIcon = (iconName?: string) => {
        if (iconName === 'key') return <KeyRound className="h-4 w-4" />
        return <Plus className="h-4 w-4" />
    }

    const colSpanValue = columns.length + (hasActions ? 1 : 0)

    return (
        <div className="dx-card mt-3 space-y-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                {configuration.showSearch && (
                    <div className="relative w-full max-w-sm">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchText}
                            onChange={(event) => {
                                setSearchText(event.target.value)
                                setPage(1)
                            }}
                            placeholder="Buscar..."
                            className="pl-9"
                        />
                    </div>
                )}

                <div className="flex items-center gap-2">
                    {configuration.customButtons?.map((button) => (
                        <Button
                            key={button.name}
                            variant="outline"
                            title={button.hint || button.name}
                            onClick={() => configuration.customButtonClicked?.(button.name)}
                        >
                            {getButtonIcon(button.icon)}
                            {button.hint || button.name}
                        </Button>
                    ))}

                    {configuration.allowExportExcel && (
                        <>
                            <Button variant="outline" onClick={exportToCsv}>
                                <Download className="h-4 w-4" />
                                CSV
                            </Button>
                            <Button variant="outline" onClick={exportToXlsx}>
                                <FileSpreadsheet className="h-4 w-4" />
                                XLSX
                            </Button>
                        </>
                    )}

                    {configuration.allowCreate && (
                        <Button onClick={onCreate}>
                            <Plus className="h-4 w-4" />
                            Nuevo
                        </Button>
                    )}
                </div>
            </div>

            {editingRow && (
                <div className="rounded-lg border border-border bg-muted/40 p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                        {editableColumns.map((column: ScpGridColumn) => (
                            <label key={column.dataField} className="space-y-1 text-sm">
                                <span className="font-medium">{column.caption || column.dataField}</span>
                                {column.dataType === 'boolean' ? (
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4"
                                        checked={Boolean(editingRow[column.dataField])}
                                        onChange={(event) =>
                                            setEditingRow((prev) =>
                                                prev
                                                    ? {
                                                          ...prev,
                                                          [column.dataField]: event.target.checked,
                                                      }
                                                    : prev,
                                            )
                                        }
                                    />
                                ) : (
                                    <Input
                                        value={editingRow[column.dataField] ?? ''}
                                        onChange={(event) =>
                                            setEditingRow((prev) =>
                                                prev
                                                    ? {
                                                          ...prev,
                                                          [column.dataField]: event.target.value,
                                                      }
                                                    : prev,
                                            )
                                        }
                                    />
                                )}
                            </label>
                        ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                        <Button onClick={onSave}>Guardar</Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setEditingRow(null)
                                setIsCreating(false)
                            }}
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column: ScpGridColumn) => (
                            <TableHead key={column.dataField}>
                                <button
                                    className="inline-flex items-center gap-1 text-left"
                                    onClick={() => toggleSort(column.dataField)}
                                    title={`Ordenar por ${column.caption || column.dataField}`}
                                >
                                    {column.caption || column.dataField}
                                    <ArrowDownUp className="h-3.5 w-3.5 text-muted-foreground" />
                                </button>
                            </TableHead>
                        ))}
                        {hasActions && <TableHead>Acciones</TableHead>}
                    </TableRow>
                    <TableRow>
                        {columns.map((column: ScpGridColumn) => (
                            <TableHead key={`${column.dataField}-filter`}>
                                {column.allowFiltering !== false && (
                                    <Input
                                        value={columnFilters[column.dataField] || ''}
                                        onChange={(event) => {
                                            setColumnFilters((previous) => ({
                                                ...previous,
                                                [column.dataField]: event.target.value,
                                            }))
                                            setPage(1)
                                        }}
                                        placeholder="Filtrar"
                                        className="h-8"
                                    />
                                )}
                            </TableHead>
                        ))}
                        {hasActions && <TableHead />}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={colSpanValue} className="py-8 text-center text-muted-foreground">
                                Cargando...
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading && rows.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={colSpanValue} className="py-8 text-center text-muted-foreground">
                                Sin registros
                            </TableCell>
                        </TableRow>
                    )}

                    {!isLoading &&
                        rows.map((row, index) => {
                            const rowKey = row[configuration.dataId] ?? `${configuration.dataId}-${index}`
                            return (
                                <TableRow key={rowKey}>
                                    {columns.map((column: ScpGridColumn) => (
                                        <TableCell key={`${rowKey}-${column.dataField}`}>{formatValue(row, column)}</TableCell>
                                    ))}
                                    {hasActions && (
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {configuration.allowUpdate && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setEditingRow(row)
                                                            setIsCreating(false)
                                                        }}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {configuration.allowDelete && (
                                                    <Button variant="outline" size="sm" onClick={() => onDelete(row)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            )
                        })}
                </TableBody>
            </Table>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                <div>
                    Pagina {page} de {totalPages}
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={pageSize}
                        className="form-select h-8"
                        onChange={(event) => {
                            setPageSize(Number(event.target.value))
                            setPage(1)
                        }}
                    >
                        {pageRecords.map((size: number) => (
                            <option key={size} value={size}>
                                {size} / pagina
                            </option>
                        ))}
                    </select>
                    <Button variant="outline" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                        Anterior
                    </Button>
                    <Button variant="outline" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages}>
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    )
}
