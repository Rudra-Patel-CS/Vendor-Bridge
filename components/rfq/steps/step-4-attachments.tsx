"use client"

import { useCallback, useRef, useState } from "react"
import { useRfqForm, type Attachment } from "../rfq-form-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Upload,
  FileText,
  Image,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  CloudUpload,
} from "lucide-react"

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <Image className="size-5 text-violet-500" />
  if (type.includes("pdf")) return <FileText className="size-5 text-red-500" />
  if (type.includes("word") || type.includes("document"))
    return <FileText className="size-5 text-blue-500" />
  return <File className="size-5 text-muted-foreground" />
}

export function Step4Attachments() {
  const { attachments, addAttachment, removeAttachment, updateAttachment, triggerAutoSave } =
    useRfqForm()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const simulateUpload = useCallback(
    (file: { name: string; size: number; type: string }) => {
      const id = `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      const attachment: Attachment = {
        id,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: "uploading",
        addedAt: new Date().toISOString(),
      }
      addAttachment(attachment)

      // Simulate progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30 + 10
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          updateAttachment(id, { progress: 100, status: "complete" })
          triggerAutoSave()
        } else {
          updateAttachment(id, { progress: Math.round(progress) })
        }
      }, 300)
    },
    [addAttachment, updateAttachment, triggerAutoSave]
  )

  function handleFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach((file) => {
      simulateUpload({ name: file.name, size: file.size, type: file.type })
    })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">Documents & Specifications</h3>
        <p className="text-xs text-muted-foreground">
          Attach relevant documents, technical specs, and drawings for vendors.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-all",
          isDragOver
            ? "border-primary bg-primary/5 shadow-[0_0_0_4px] shadow-primary/10"
            : "border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/50"
        )}
      >
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-xl transition-colors",
            isDragOver ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          <CloudUpload className="size-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {isDragOver ? "Drop files here" : "Drag & drop files, or click to browse"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF, DOCX, PNG, JPG up to 25 MB each
          </p>
        </div>
        <Button variant="outline" size="sm" type="button" className="pointer-events-none">
          <Upload data-icon="inline-start" />
          Choose Files
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xls,.xlsx"
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ""
          }}
        />
      </div>

      {/* File list */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">
            {attachments.length} file{attachments.length !== 1 ? "s" : ""} attached
          </div>
          <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
              >
                {/* Icon */}
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  {getFileIcon(att.type)}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {att.name}
                    </span>
                    {att.status === "complete" && (
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                    )}
                    {att.status === "error" && (
                      <AlertCircle className="size-3.5 shrink-0 text-destructive" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(att.size)}
                    </span>
                    {att.status === "uploading" && (
                      <span className="text-xs text-primary tabular-nums">
                        {att.progress}%
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {att.status === "uploading" && (
                    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${att.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Remove */}
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => removeAttachment(att.id)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <X />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
