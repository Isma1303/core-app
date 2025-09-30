/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { Button } from 'devextreme-react'
import notify from 'devextreme/ui/notify'
import { DragEvent, forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { ClickEvent } from 'devextreme/ui/button'
import { confirm } from 'devextreme/ui/dialog'

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
            return notify('Sólo se permiten subir archivos con extensión xlsx', 'error', 3600)

        const activeFile = files[0]

        if (activeFile === undefined || activeFile === null) {
            setFileName('')
            return
        }

        setFileName(activeFile.name)
        const newFile = cloneFile(activeFile)

        setXlsxFile(newFile)
        setEnableFinishButton(true)
        notify('Archivo preparado exitosamente', 'success', 3600)
    }

    const onFileSelected = async (event: any) => {
        event.preventDefault()

        const files = event.target.files

        if (files[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            return notify('Sólo se permiten subir archivos con extensión xlsx', 'error', 3600)

        const activeFile = files[0]
        setXlsxFile(activeFile)

        if (activeFile === undefined || activeFile === null) {
            setFileName('')
            return
        }
        setFileName(activeFile.name)

        setEnableFinishButton(true)
        notify('Archivo preparado exitosamente', 'success', 3600)
    }

    const cloneFile = (originalFile: File): File => new File([originalFile], originalFile.name, { type: originalFile.type })

    const onProcessFile = async (event: ClickEvent) => {
        const confirmResponse = await confirm('¿Está seguro de cargar el archivo seleccionado?', 'Confirmación')
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
                    <Button
                        disabled={!enableFinishButton}
                        height="3em"
                        icon="cloud-upload"
                        type="default"
                        text="Procesar archivo"
                        onClick={onProcessFile}
                    />
                </div>
            </div>
        </div>
    )
})
