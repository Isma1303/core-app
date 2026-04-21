/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { DragEvent, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import './FileUpload.scss'
import { Button } from '@/components/ui/button'
import { CheckCircle2, UploadCloud } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
    onFileProcessed: (file: File) => Promise<void>
}

// Definir los métodos que estarán disponibles en la referencia
export interface FileUploadRef {
    reset: () => void
}

export const FileUpload = forwardRef<FileUploadRef, Props>(({ onFileProcessed }: Props, ref): JSX.Element => {
    const inputFile = useRef<HTMLInputElement>(null)
    const [enableFinishButton, setEnableFinishButton] = useState<boolean>(false)
    const [fileName, setFileName] = useState<string>('')
    const [xlsxFile, setXlsxFile] = useState<File | undefined | null>(null)

    const onDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
    }

    const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
    }

    const onDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        const files = event.dataTransfer.files

        if (files[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            return toast.error('Sólo se permiten subir archivos con extensión xlsx')

        const activeFile = files[0]

        if (activeFile === undefined || activeFile === null) {
            setFileName('')
            return
        }

        setFileName(activeFile.name)
        const newFile = cloneFile(activeFile)

        setXlsxFile(newFile)
        setEnableFinishButton(true)
        toast.success('Archivo preparado exitosamente')
    }

    const onFileSelected = async (event: any) => {
        event.preventDefault()

        const files = event.target.files

        if (files[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            return toast.error('Sólo se permiten subir archivos con extensión xlsx')

        const activeFile = files[0]
        setXlsxFile(activeFile)

        if (activeFile === undefined || activeFile === null) {
            setFileName('')
            return
        }
        setFileName(activeFile.name)

        setEnableFinishButton(true)
        toast.success('Archivo preparado exitosamente')
    }

    const cloneFile = (originalFile: File): File => new File([originalFile], originalFile.name, { type: originalFile.type })

    const onProcessFile = async () => {
        const confirmResponse = window.confirm('¿Está seguro de cargar el archivo seleccionado?')
        if (!confirmResponse) return

        if (xlsxFile === null || xlsxFile === undefined) return
        onFileProcessed(xlsxFile as File)
    }

    const resetState = () => {
        setEnableFinishButton(false)
        setFileName('')
        setXlsxFile(null)
        if (inputFile.current) {
            inputFile.current.value = ''
        }
    }

    useImperativeHandle(ref, () => ({
        reset: resetState,
    }))

    return (
        <div className="file-upload-component">
            <div className="mb-2">
                <div
                    className="drag-and-drop mt-2"
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => inputFile.current?.click()}
                >
                    <p className="text-sm text-muted-foreground">Arrastre el archivo aquí</p>
                    <input type="file" onChange={onFileSelected} accept=".xlsx" className="input-file" ref={inputFile} />
                    <Button type="button" variant="outline">
                        Seleccione el archivo
                    </Button>
                    <div className="mt-2 text-foreground">
                        {fileName === '' ? <UploadCloud className="mx-auto h-12 w-12" /> : <CheckCircle2 className="mx-auto h-12 w-12" />}
                    </div>
                    {fileName !== '' && <p className="mt-2 text-sm font-medium">{fileName}</p>}
                </div>
            </div>

            <div className="mt-3 flex justify-end">
                <div>
                    <Button className="h-10" disabled={!enableFinishButton} onClick={onProcessFile}>
                        Procesar archivo
                    </Button>
                </div>
            </div>
        </div>
    )
})
