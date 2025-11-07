"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, ImageIcon, Video, File as FileIcon, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  maxSizeMB?: number
  acceptedTypes?: string[]
}

interface FilePreview {
  id: string
  name: string
  type: string
  size: number
  url: string
  file: File
}

export function FileUpload({ 
  onFilesChange, 
  maxFiles = 10, 
  maxSizeMB = 10,
  acceptedTypes = ["image/*", "video/*"] 
}: FileUploadProps) {
  const [files, setFiles] = useState<FilePreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return `El archivo "${file.name}" excede el tamaño máximo de ${maxSizeMB}MB`
    }

    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    
    if (isImage) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!validImageTypes.includes(file.type)) {
        return `Formato de imagen no válido. Use JPEG, PNG, GIF o WebP`
      }
    } else if (isVideo) {
      const validVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm']
      if (!validVideoTypes.includes(file.type)) {
        return `Formato de video no válido. Use MP4, MPEG, MOV o WebM`
      }
    } else {
      return `Tipo de archivo no permitido. Solo imágenes y videos`
    }

    return null
  }

  const processFiles = (selectedFiles: File[]) => {
    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: "Límite excedido",
        description: `Solo puedes subir hasta ${maxFiles} archivos`,
        variant: "destructive",
      })
      return
    }

    const validFiles: File[] = []
    const errors: string[] = []
    
    for (const file of selectedFiles) {
      const error = validateFile(file)
      if (error) {
        errors.push(error)
        continue
      }
      validFiles.push(file)
    }

    if (errors.length > 0 && validFiles.length === 0) {
      toast({
        title: "Archivos rechazados",
        description: errors[0],
        variant: "destructive",
      })
      return
    }

    if (validFiles.length === 0) return

    const newFiles: FilePreview[] = validFiles.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      file: file
    }))

    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    onFilesChange(updatedFiles.map((f) => f.file))

    toast({
      title: "✓ Archivos agregados",
      description: `${validFiles.length} archivo(s) listo(s) para subir${errors.length > 0 ? `. ${errors.length} rechazado(s)` : ''}`,
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    processFiles(selectedFiles)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget === dropZoneRef.current) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }

  const removeFile = (id: string) => {
    const fileToRemove = files.find(f => f.id === id)
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url)
    }
    
    const updatedFiles = files.filter((f) => f.id !== id)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles.map((f) => f.file))
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        ref={dropZoneRef}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-all duration-200",
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="p-8 text-center space-y-4">
          <div className={cn(
            "mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200",
            isDragging 
              ? "bg-primary/20 scale-110" 
              : "bg-muted"
          )}>
            <Upload className={cn(
              "w-8 h-8 transition-all duration-200",
              isDragging 
                ? "text-primary scale-110" 
                : "text-muted-foreground"
            )} />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <p className="text-base font-medium">
                {isDragging 
                  ? "¡Suelta los archivos aquí!" 
                  : "Arrastra archivos o haz clic para buscar"
                }
              </p>
              <Badge variant="secondary" className="text-xs">
                {files.length}/{maxFiles}
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Máximo {maxFiles} archivos • {maxSizeMB}MB cada uno</p>
              <p className="text-xs">
                <span className="inline-flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  JPEG, PNG, GIF, WebP
                </span>
                {" • "}
                <span className="inline-flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  MP4, MPEG, MOV, WebM
                </span>
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant={isDragging ? "default" : "outline"}
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= maxFiles}
            className="mx-auto"
          >
            <Upload className="w-4 h-4 mr-2" />
            Seleccionar archivos
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              Archivos seleccionados ({files.length})
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                files.forEach(f => URL.revokeObjectURL(f.url))
                setFiles([])
                onFilesChange([])
              }}
              className="text-xs"
            >
              Limpiar todos
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {files.map((file) => (
              <Card 
                key={file.id} 
                className="group overflow-hidden border-muted-foreground/20 hover:border-muted-foreground/40 transition-all duration-200 hover:shadow-md"
              >
                <CardContent className="p-0">
                  <div className="flex items-start gap-3 p-3">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      {file.type.startsWith("image/") ? (
                        <>
                          <img 
                            src={file.url} 
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        </>
                      ) : file.type.startsWith("video/") ? (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                          <Video className="w-10 h-10 text-purple-600" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileIcon className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 py-1">
                      <p className="text-sm font-medium truncate mb-2">{file.name}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge 
                          variant={file.type.startsWith("image/") ? "default" : "secondary"} 
                          className="text-xs"
                        >
                          {file.type.split("/")[0] === "image" ? (
                            <ImageIcon className="w-3 h-3 mr-1" />
                          ) : (
                            <Video className="w-3 h-3 mr-1" />
                          )}
                          {file.type.split("/")[1].toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeFile(file.id)}
                      className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
