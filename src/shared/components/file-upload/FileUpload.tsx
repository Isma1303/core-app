/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { DragEvent, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import './FileUpload.scss'

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
            return alert('Sólo se permiten subir archivos con extensión xlsx')

        const activeFile = files[0]

        if (activeFile === undefined || activeFile === null) {
            setFileName('')
            return
        }

        setFileName(activeFile.name)
        const newFile = cloneFile(activeFile)

        setXlsxFile(newFile)
        setEnableFinishButton(true)
        alert('Archivo preparado exitosamente')
    }

    const onFileSelected = async (event: any) => {
        event.preventDefault()

        const files = event.target.files

        if (files[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            return alert('Sólo se permiten subir archivos con extensión xlsx')

        const activeFile = files[0]
        setXlsxFile(activeFile)

        if (activeFile === undefined || activeFile === null) {
            setFileName('')
            return
        }
        setFileName(activeFile.name)

        setEnableFinishButton(true)
        alert('Archivo preparado exitosamente')
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
            <div className="row mx-3 mb-2">
                <div
                    className="drag-and-drop mt-2"
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => inputFile.current?.click()}
                >
                    <p>Arrastre el archivo aquí</p>
                    <input type="file" onChange={onFileSelected} accept=".xlsx" className="input-file" ref={inputFile} />
                    <button type="button" className="btn">
                        Seleccione el archivo
                    </button>
                    <div>{fileName === '' ? <i className="bi-cloud-upload-fill"></i> : <i className="bi bi-check-circle-fill"></i>}</div>
                    {fileName !== '' && <p>{fileName}</p>}
                </div>
            </div>

            <div className="row mx-3">
                <div className="col d-flex justify-content-end mt-3">
                    <button
                        className="btn btn-primary"
                        disabled={!enableFinishButton}
                        onClick={onProcessFile}
                        style={{ height: '3em' }}
                    >
                        Procesar archivo
                    </button>
                </div>
            </div>
        </div>
    )
}))
