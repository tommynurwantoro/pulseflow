'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface InlineEditableFieldProps {
  value: string | number
  onSave: (value: string | number) => Promise<void>
  type?: 'text' | 'number'
  className?: string
  placeholder?: string
}

export function InlineEditableField({
  value,
  onSave,
  type = 'text',
  className = '',
  placeholder,
}: InlineEditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(String(value))
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const finalValue = type === 'number' ? parseFloat(editValue) || 0 : editValue
      await onSave(finalValue)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(String(value))
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        disabled={isSaving}
        className={`${className} border-blue-500 focus:ring-blue-500`}
        placeholder={placeholder}
      />
    )
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 px-2 py-1 rounded transition-colors min-h-[2rem] flex items-center`}
      title="Click to edit"
    >
      {value || <span className="text-gray-400 italic">{placeholder || 'Click to edit'}</span>}
    </div>
  )
}
