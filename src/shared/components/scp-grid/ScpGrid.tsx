import { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScpGridProps, ScpGridColumn } from '../../interfaces'
import { ArrowDownUp, Download, FileSpreadsheet, KeyRound, ListChecks, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { saveAs } from 'file-saver'
import { cn } from '@/lib/utils'

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

export const ScpGrid = forwardRef(({ configuration }: ScpGridProps, ref: any) => {
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
    const [selectedId, setSelectedId] = useState<string | number | null>(null)
    const [selectedRows, setSelectedRows] = useState<Record<string, any>[]>([])
    const [changes, setChanges] = useState<Record<string, any>>({})
    const showSelectionColumn = Boolean(configuration.showSelectionColumn)

    const isStoreLike = configuration.dataSource && typeof configuration.dataSource.load === 'function'
    const hasActions = Boolean(configuration.allowUpdate || configuration.allowDelete)

    useImperativeHandle(ref, () => ({
        getSelectedRowsData: () => selectedRows,
        getSelectedRowKeys: () => selectedRows.map((row) => row[configuration.dataId]),
        deselectRows: () => {
            setSelectedRows([])
            setSelectedId(null)
        },
        refresh: fetchRows,
    }))

    const matchesColumnFilters = (row: Record<string, any>): boolean => {
        return columns.every((column: ScpGridColumn) => {
            const filterValue = normalizeText(columnFilters[column.dataField])
            if (!filterValue) return true

            const rowValue = normalizeText(formatValue(row, column))
            return rowValue.includes(filterValue)
        })
    }

    const selectRow = (row: Record<string, any>) => {
        const id = row[configuration.dataId]
        setSelectedId(id)
        setSelectedRows([row])
        if (configuration.onSelectionChanged) {
            configuration.onSelectionChanged({
                selectedRowsData: [row],
            })
        }
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

                const sourceRows = Array.isArray(result) ? result : (result.data ?? [])
                const filteredRows = sourceRows.filter(matchesColumnFilters)
                setRows(filteredRows)
                setTotalCount(Array.isArray(result) ? filteredRows.length : (result.totalCount ?? filteredRows.length))
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

    const getLookupValue = (column: ScpGridColumn, value: any): string => {
        if (!column.lookup?.dataSource || !column.lookup.valueExpr || !column.lookup.displayExpr) return String(value ?? '')

        const lookupItem = column.lookup.dataSource.find((item) => item[column.lookup?.valueExpr as string] === value)
        if (!lookupItem) return String(value ?? '')

        return String(lookupItem[column.lookup.displayExpr] ?? '')
    }

    const isLookupNumeric = (column: ScpGridColumn): boolean => {
        if (!column.lookup?.dataSource?.length || !column.lookup.valueExpr) return false

        const sampleValue = column.lookup.dataSource[0][column.lookup.valueExpr]
        return typeof sampleValue === 'number'
    }

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

    const onBatchSave = async () => {
        if (!configuration.onSaving) return

        const changesArray = Object.keys(changes).map((key) => ({
            key: isNaN(Number(key)) ? key : Number(key),
            type: 'update',
            data: changes[key],
        }))

        await configuration.onSaving({
            changes: changesArray,
            cancel: false,
        })

        setChanges({})
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

    const handleRowClick = (row: Record<string, any>) => {
        selectRow(row)
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

    const colSpanValue = columns.length + (hasActions ? 1 : 0) + (showSelectionColumn ? 1 : 0)

    return (
        <Card className="mt-3 overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md animate-in fade-in duration-500">
            <CardHeader className="border-b border-border/50 bg-muted/10 p-4">
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
                                className="pl-9 h-10 border-border/50 focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all bg-background"
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        {configuration.customButtons?.map((button) => (
                            <Button
                                key={button.name}
                                variant="outline"
                                size="sm"
                                className="h-10 border-border/50 transition-all hover:bg-foreground/5"
                                title={button.hint || button.name}
                                onClick={() => configuration.customButtonClicked?.(button.name)}
                            >
                                {getButtonIcon(button.icon)}
                                <span className="hidden sm:inline">{button.hint || button.name}</span>
                            </Button>
                        ))}

                        {configuration.allowExportExcel && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 border-border/50 transition-all hover:bg-foreground/5"
                                    onClick={exportToCsv}
                                >
                                    <Download className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">CSV</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 border-border/50 transition-all hover:bg-foreground/5"
                                    onClick={exportToXlsx}
                                >
                                    <FileSpreadsheet className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">XLSX</span>
                                </Button>
                            </>
                        )}

                        {Object.keys(changes).length > 0 && (
                            <Button
                                size="sm"
                                onClick={onBatchSave}
                                className="h-10 bg-green-600 text-white hover:bg-green-700 transition-all active:scale-[0.98]"
                            >
                                <ListChecks className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Guardar Cambios</span>
                            </Button>
                        )}
                        {configuration.allowCreate && (
                            <Button
                                size="sm"
                                onClick={onCreate}
                                className="h-10 bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-[0.98]"
                            >
                                <Plus className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Nuevo</span>
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                {editingRow && (
                    <div className="rounded-lg border border-border/50 bg-muted/20 p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid gap-4 md:grid-cols-2">
                            {editableColumns.map((column: ScpGridColumn) => (
                                <div key={column.dataField} className="space-y-1.5 text-sm">
                                    <label className="font-medium text-foreground/90">{column.caption || column.dataField}</label>
                                    {column.dataType === 'boolean' ? (
                                        <div className="h-9 flex items-center">
                                            <Checkbox
                                                checked={Boolean(editingRow[column.dataField])}
                                                onCheckedChange={(checked) =>
                                                    setEditingRow((prev) =>
                                                        prev
                                                            ? {
                                                                  ...prev,
                                                                  [column.dataField]: checked === true,
                                                              }
                                                            : prev,
                                                    )
                                                }
                                            />
                                        </div>
                                    ) : column.lookup?.dataSource?.length ? (
                                        <Select
                                            value={String(editingRow[column.dataField] ?? '')}
                                            onValueChange={(value) =>
                                                setEditingRow((prev) =>
                                                    prev
                                                        ? {
                                                              ...prev,
                                                              [column.dataField]: value === '' ? '' : isLookupNumeric(column) ? Number(value) : value,
                                                          }
                                                        : prev,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-9 border-border/50 bg-background focus:ring-1 focus:ring-foreground/20">
                                                <SelectValue placeholder={`Seleccionar ${column.caption || column.dataField}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {column.lookup.dataSource.map((item, index) => {
                                                    const itemValue = item[column.lookup?.valueExpr as string]
                                                    const itemLabel = getLookupValue(column, itemValue) || String(itemValue ?? index)

                                                    return (
                                                        <SelectItem
                                                            key={`${column.dataField}-${String(itemValue ?? index)}`}
                                                            value={String(itemValue)}
                                                        >
                                                            {itemLabel}
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            className="h-9 border-border/50 focus-visible:ring-1 focus-visible:ring-foreground/20 transition-all"
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
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-border/50 hover:bg-foreground/5 transition-all"
                                onClick={() => {
                                    setEditingRow(null)
                                    setIsCreating(false)
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                size="sm"
                                className="bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98] transition-all"
                                onClick={onSave}
                            >
                                Guardar
                            </Button>
                        </div>
                    </div>
                )}

                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            {showSelectionColumn && <TableHead className="w-[52px]" />}
                            {columns.map((column: ScpGridColumn) => (
                                <TableHead key={column.dataField} className="font-semibold text-foreground">
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
                            {hasActions && <TableHead className="text-right font-semibold text-foreground">Acciones</TableHead>}
                        </TableRow>
                        <TableRow>
                            {showSelectionColumn && <TableHead />}
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
                                            className="h-8 bg-background border-border/50 focus-visible:ring-1 focus-visible:ring-foreground/20"
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
                                    <TableRow
                                        key={rowKey}
                                        className={cn(
                                            'group cursor-pointer transition-colors hover:bg-muted/50',
                                            selectedId === row[configuration.dataId] && 'bg-muted font-medium',
                                        )}
                                        onClick={() => handleRowClick(row)}
                                    >
                                        {showSelectionColumn && (
                                            <TableCell className="w-[52px]" onClick={(event) => event.stopPropagation()}>
                                                <Checkbox
                                                    checked={selectedId === row[configuration.dataId]}
                                                    onCheckedChange={(checked) => {
                                                        if (checked === true) {
                                                            selectRow(row)
                                                            return
                                                        }
                                                        setSelectedRows([])
                                                        setSelectedId(null)
                                                    }}
                                                />
                                            </TableCell>
                                        )}
                                        {columns.map((column: ScpGridColumn) => (
                                            <TableCell
                                                key={`${rowKey}-${column.dataField}`}
                                                className="text-muted-foreground group-hover:text-foreground transition-colors"
                                            >
                                                {column.dataType === 'boolean' && column.allowEditing !== false ? (
                                                    <Checkbox
                                                        checked={changes[rowKey]?.assigned ?? row[column.dataField]}
                                                        onCheckedChange={(checked) => {
                                                            setChanges((prev) => ({
                                                                ...prev,
                                                                [rowKey]: { ...prev[rowKey], assigned: checked === true },
                                                            }))
                                                        }}
                                                    />
                                                ) : (
                                                    formatValue(row, column)
                                                )}
                                            </TableCell>
                                        ))}
                                        {hasActions && (
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {configuration.allowUpdate && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                            onClick={(event) => {
                                                                event.stopPropagation()
                                                                if (configuration.onEditClick) {
                                                                    configuration.onEditClick(row)
                                                                } else {
                                                                    setEditingRow(row)
                                                                    setIsCreating(false)
                                                                }
                                                            }}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {configuration.allowDelete && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all"
                                                            onClick={(event) => {
                                                                event.stopPropagation()
                                                                onDelete(row)
                                                            }}
                                                        >
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
                        Página {page} de {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                        <Select
                            value={String(pageSize)}
                            onValueChange={(value) => {
                                setPageSize(Number(value))
                                setPage(1)
                            }}
                        >
                            <SelectTrigger className="h-8 w-[130px] border-border/50 focus:ring-1 focus:ring-foreground/20">
                                <SelectValue placeholder="Tamaño" />
                            </SelectTrigger>
                            <SelectContent>
                                {pageRecords.map((size: number) => (
                                    <SelectItem key={size} value={String(size)}>
                                        {size} / página
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                            disabled={page >= totalPages}
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
})
