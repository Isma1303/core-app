import { useMemo, useState } from 'react'
import { format, isValid, parse, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarDays, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const INPUT_PATTERNS = ['yyyy-MM-dd', 'dd/MM/yyyy', 'dd-MM-yyyy', 'yyyy/MM/dd', 'yyyy-MM-dd HH:mm:ss']

const DATE_PLACEHOLDER = 'Seleccionar fecha'

export function parseDateValue(value: unknown): Date | undefined {
    if (value === null || value === undefined || value === '') return undefined
    if (value instanceof Date) return isValid(value) ? value : undefined
    if (typeof value === 'number') {
        const fromTimestamp = new Date(value)
        return isValid(fromTimestamp) ? fromTimestamp : undefined
    }

    const text = String(value).trim()
    if (!text) return undefined

    const isoDate = parseISO(text)
    if (isValid(isoDate)) return isoDate

    for (const pattern of INPUT_PATTERNS) {
        const parsed = parse(text, pattern, new Date())
        if (isValid(parsed)) return parsed
    }

    const fallback = new Date(text)
    return isValid(fallback) ? fallback : undefined
}

export function formatDateValue(value: unknown, pattern = 'dd/MM/yyyy'): string {
    const date = parseDateValue(value)
    return date ? format(date, pattern) : ''
}

export function toDateKey(value: unknown): string {
    const date = parseDateValue(value)
    return date ? format(date, 'yyyy-MM-dd') : ''
}

export function serializeDateValue(date: Date, previousValue?: unknown): string {
    const datePart = format(date, 'yyyy-MM-dd')

    if (typeof previousValue === 'string') {
        const timePart = previousValue.match(/[T ].+$/)
        if (timePart) return `${datePart}${timePart[0]}`
    }

    return datePart
}

interface DataGridDatePickerProps {
    value?: unknown
    onChange: (value: string | null) => void
    placeholder?: string
    className?: string
    compact?: boolean
    disabled?: boolean
    clearable?: boolean
    startMonth?: Date
    endMonth?: Date
}

const DEFAULT_START_MONTH = new Date(1900, 0, 1)
const DEFAULT_END_MONTH = new Date(new Date().getFullYear() + 10, 11, 1)

export function DataGridDatePicker({
    value,
    onChange,
    placeholder = DATE_PLACEHOLDER,
    className,
    compact = false,
    disabled = false,
    clearable = true,
    startMonth = DEFAULT_START_MONTH,
    endMonth = DEFAULT_END_MONTH,
}: DataGridDatePickerProps) {
    const [open, setOpen] = useState(false)
    const selected = useMemo(() => parseDateValue(value), [value])

    const selectDate = (date: Date | undefined) => {
        setOpen(false)
        onChange(date ? serializeDateValue(date, value) : null)
    }

    const selectToday = () => {
        setOpen(false)
        onChange(serializeDateValue(new Date(), value))
    }

    return (
        <div className={cn('relative', className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        data-empty={!selected}
                        className={cn(
                            'w-full justify-start gap-2 text-left font-normal data-[empty=true]:text-muted-foreground',
                            compact ? 'h-7 pr-7 text-[0.8rem]' : 'h-9 pr-8',
                        )}
                    >
                        <CalendarDays data-icon="inline-start" />
                        <span className="truncate">
                            {selected
                                ? compact
                                    ? format(selected, 'dd/MM/yyyy')
                                    : format(selected, 'PPP', { locale: es })
                                : placeholder}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto gap-0 overflow-hidden p-0">
                    <Calendar
                        mode="single"
                        selected={selected}
                        defaultMonth={selected}
                        onSelect={selectDate}
                        locale={es}
                        captionLayout="dropdown"
                        startMonth={startMonth}
                        endMonth={endMonth}
                    />
                    <div className="flex items-center justify-between gap-2 border-t p-2">
                        <Button type="button" variant="ghost" size="xs" onClick={selectToday}>
                            Hoy
                        </Button>
                        {clearable && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="xs"
                                className="text-muted-foreground"
                                onClick={() => selectDate(undefined)}
                            >
                                Limpiar
                            </Button>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            {clearable && selected && !disabled && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Limpiar fecha"
                    className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
                    onClick={() => onChange(null)}
                >
                    <X />
                </Button>
            )}
        </div>
    )
}
