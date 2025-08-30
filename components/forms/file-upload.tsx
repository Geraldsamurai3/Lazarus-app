"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, ImageIcon, Video, File } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  onFilesChange: (files: string[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
}

export function FileUpload({ onFilesChange, maxFiles = 5, acceptedTypes = ["image/*", "video/*"] }: FileUploadProps) {
  const [files, setFiles] = useState<Array<{ id: string; name: string; type: string; url: string }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])

    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: "Límite excedido",
        description: `Solo puedes subir hasta ${maxFiles} archivos`,
        variant: "destructive",
      })
      return
    }

    const newFiles = selectedFiles.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }))

    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    onFilesChange(updatedFiles.map((f) => f.url))

    toast({
      title: "Archivos agregados",
      description: `Se agregaron ${selectedFiles.length} archivo(s)`,
    })
  }

  const removeFile = (id: string) => {
    const updatedFiles = files.filter((f) => f.id !== id)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles.map((f) => f.url))
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />
    if (type.startsWith("video/")) return <Video className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={files.length >= maxFiles}
        >
          <Upload className="w-4 h-4 mr-2" />
          Subir archivos
        </Button>
        <Badge variant="secondary">
          {files.length}/{maxFiles}
        </Badge>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <Card key={file.id} className="bg-muted/50">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.type.split("/")[0].toUpperCase()}</p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Instructions */}
      {files.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Haz clic en "Subir archivos" para agregar fotos o videos</p>
            <p className="text-xs text-muted-foreground mt-1">Máximo {maxFiles} archivos</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
