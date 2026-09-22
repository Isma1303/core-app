import { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination } from '@/components/ui/pagination'
import { DataGridProps, DataGridColumn } from '../../interfaces'
import { ArrowDownUp, Download, FileSpreadsheet, KeyRound, ListChecks, Pencil, Plus, Search, Trash2, ChevronLeft, ChevronRight, ChevronFirst, ChevronLast } from 'lucide-react'
import { saveAs } from 'file-saver'
import { cn } from '@/lib/utils'

const DEFAULT_PAGE_SIZES = [5, 10, 20]

export const DataGrid = forwardRef(({ configuration }: DataGridProps, ref: any) => {
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
    const [lookupData, setLookupData] = useState<Record<string, any[]>>({})
    const showSelectionColumn = Boolean(configuration.showSelectionColumn)

    const isStoreLike = configuration.dataSource && typeof configuration.dataSource.load === 'function'
    const hasActions = Boolean(configuration.allowUpdate || configuration.allowDelete)

    const fetchLookupData = async () => {
        const promises = columns.map(async (column) => {
            if (column.lookup) {
                if (Array.isArray(column.lookup.dataSource)) {
                    return { field: column.dataField, data: column.lookup.dataSource }
                } else if (typeof column.lookup.dataSource === 'function') {
                    try {
                        const data = await column.lookup.dataSource()
                        return { field: column.dataField, data }
                    } catch (error) {
                        console.error(`Error fetching lookup data for ${column.dataField}:`, error)
                        return { field: column.dataField, data: [] }
                    }
                }
            }
            return null
        })

        const results = await Promise.all(promises)
        const newLookupData: Record<string, any[]> = {}
        results.forEach((result) => {
            if (result) {
                newLookupData[result.field] = result.data
            }
        })
        setLookupData(newLookupData)
    }

    useEffect(() => {
        fetchLookupData()
    }, [columns])

    const normalizeText = (value: any): string =>
        String(value ?? '')
            .toLowerCase()
            .trim()

    const formatValue = (row: Record<string, any>, column: DataGridColumn): string => {
        const value = row[column.dataField]
        const dataSource = lookupData[column.dataField] || (Array.isArray(column.lookup?.dataSource) ? column.lookup?.dataSource : [])

        if (column.lookup && dataSource.length > 0 && column.lookup.valueExpr && column.lookup.displayExpr) {
            const lookupItem = dataSource.find((item) => item[column.lookup?.valueExpr as string] === value)
            if (lookupItem) return String(lookupItem[column.lookup.displayExpr])
        }

        if (typeof value === 'boolean') return value ? 'Si' : 'No'
        return String(value ?? '-')
    }

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
        return columns.every((column: DataGridColumn) => {
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
                          columns.some((column: DataGridColumn) => normalizeText(row[column.dataField]).includes(normalizeText(searchText))),
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
        () => columns.filter((column: DataGridColumn) => column.dataField !== configuration.dataId),
        [columns, configuration.dataId],
    )

    const getLookupValue = (column: DataGridColumn, value: any): string => {
        const dataSource = lookupData[column.dataField] || (Array.isArray(column.lookup?.dataSource) ? column.lookup?.dataSource : [])
        if (!dataSource.length || !column.lookup?.valueExpr || !column.lookup.displayExpr) return String(value ?? '')

        const lookupItem = dataSource.find((item) => item[column.lookup?.valueExpr as string] === value)
        if (!lookupItem) return String(value ?? '')

        return String(lookupItem[column.lookup.displayExpr] ?? '')
    }

    const isLookupNumeric = (column: DataGridColumn): boolean => {
        const dataSource = lookupData[column.dataField] || (Array.isArray(column.lookup?.dataSource) ? column.lookup?.dataSource : [])
        if (!dataSource.length || !column.lookup?.valueExpr) return false

        const sampleValue = dataSource[0][column.lookup.valueExpr]
        return typeof sampleValue === 'number'
    }

    const onDelete = async (row: Record<string, any>) => {
        if (!configuration.allowDelete) return

        if (configuration.onDeleteClick) {
            configuration.onDeleteClick(row)
            return
        }

        if (!isStoreLike) return
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
        editableColumns.forEach((column: DataGridColumn) => {
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
            columns.forEach((column: DataGridColumn) => {
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
        if (iconName === 'key') return <KeyRound />
        return <Plus />
    }

    const colSpanValue = columns.length + (hasActions ? 1 : 0) + (showSelectionColumn ? 1 : 0)

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize)
        setPage(1)
    }

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
                                    onClick={exportToCsv}
                                >
                                    <Download data-icon="inline-start" />
                                    <span className="hidden sm:inline">CSV</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={exportToXlsx}
                                >
                                    <FileSpreadsheet data-icon="inline-start" />
                                    <span className="hidden sm:inline">XLSX</span>
                                </Button>
                            </>
                        )}

                        {Object.keys(changes).length > 0 && (
                            <Button
                                size="sm"
                                variant="default"
                                onClick={onBatchSave}
                            >
                                <ListChecks data-icon="inline-start" />
                                <span className="hidden sm:inline">Guardar Cambios</span>
                            </Button>
                        )}
                        {configuration.allowCreate && (
                            <Button
                                size="sm"
                                onClick={onCreate}
                            >
                                <Plus data-icon="inline-start" />
                                <span className="hidden sm:inline">Nuevo</span>
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                {editingRow && (
                    <div className="rounded-lg border border-border/50 bg-muted/20 p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid gap-4 md:grid-cols-2">
                            {editableColumns.map((column: DataGridColumn) => (
                                <div key={column.dataField} className="flex flex-col gap-1.5 text-sm">
                                    <label className="font-medium text-foreground/90">{column.caption || column.dataField}</label>
                                    {column.dataType === 'boolean' ? (
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
                                    ) : column.lookup ? (
                                        <Select
                                            value={editingRow[column.dataField] === null ? 'null' : String(editingRow[column.dataField] ?? '')}
                                            onValueChange={(value) =>
                                                setEditingRow((prev) =>
                                                    prev
                                                        ? {
                                                              ...prev,
                                                              [column.dataField]:
                                                                  value === '' || value === 'null'
                                                                      ? null
                                                                      : isLookupNumeric(column)
                                                                        ? Number(value)
                                                                        : value,
                                                          }
                                                        : prev,
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-9 border-border/50 bg-background focus:ring-1 focus:ring-foreground/20">
                                                <SelectValue placeholder={`Seleccionar ${column.caption || column.dataField}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="null">Ninguno</SelectItem>
                                                {(
                                                    lookupData[column.dataField] ||
                                                    (Array.isArray(column.lookup?.dataSource) ? column.lookup?.dataSource : [])
                                                ).map((item, index) => {
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
                                                              [column.dataField]: event.target.value === '' ? null : event.target.value,
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
                                onClick={() => {
                                    setEditingRow(null)
                                    setIsCreating(false)
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button size="sm" onClick={onSave}>
                                Guardar
                            </Button>
                        </div>
                    </div>
                )}

                <div className="overflow-auto">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                {showSelectionColumn && <TableHead className="w-[52px]" />}
                                {columns.map((column: DataGridColumn) => (
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
                                {columns.map((column: DataGridColumn) => (
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
                                    <TableCell colSpan={colSpanValue} className="py-8 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Skeleton className="h-4 w-24" />
                                            <span className="text-muted-foreground">Cargando...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}

                            {!isLoading && rows.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={colSpanValue} className="py-12">
                                        <Empty
                                            title="Sin registros"
                                            description="No se encontraron datos que coincidan con los filtros aplicados."
                                        />
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
                                            {columns.map((column: DataGridColumn) => (
                                                <TableCell
                                                    key={`${rowKey}-${column.dataField}`}
                                                    className="text-muted-foreground group-hover:text-foreground transition-colors"
                                                >
                                                    {column.cellTemplate ? (
                                                        column.cellTemplate(row)
                                                    ) : column.dataType === 'boolean' && column.allowEditing !== false ? (
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
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
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
                                                                        <Pencil />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Editar</TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                        {configuration.allowDelete && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={(event) => {
                                                                            event.stopPropagation()
                                                                            onDelete(row)
                                                                        }}
                                                                    >
                                                                        <Trash2 />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Eliminar</TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    )
                                })}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-border/50">
                    <div className="text-sm text-muted-foreground">
                        Página {page} de {totalPages} · {totalCount} registros
                    </div>
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        showPageSize
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        pageSizeOptions={pageRecords}
                    />
                </div>
            </CardContent>
        </Card>
    )
})
