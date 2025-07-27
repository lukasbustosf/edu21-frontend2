'use client'

import React from 'react'
import { Dialog } from './dialog'

interface ResponsiveModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function ResponsiveModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}: ResponsiveModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className={`w-full ${sizeClasses[size]} mx-auto`}>
        <div className="bg-white rounded-lg shadow-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          </div>
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </Dialog>
  )
}

// Convenience components for different modal types
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "primary",
  loading = false
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "primary" | "danger"
  loading?: boolean
}) {
  const buttonClass = variant === "danger" ? "btn-danger" : "btn-primary"

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex space-x-3 sm:space-x-4 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-secondary btn-responsive disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={buttonClass}
          >
            {loading ? "Procesando..." : confirmText}
          </button>
        </div>
      }
    >
      <p className="text-mobile-sm text-gray-700">{message}</p>
    </ResponsiveModal>
  )
}

export function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = "Guardar",
  cancelText = "Cancelar",
  loading = false,
  submitDisabled = false,
  size = "md"
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSubmit: () => void
  submitText?: string
  cancelText?: string
  loading?: boolean
  submitDisabled?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={
        <div className="flex space-x-3 sm:space-x-4 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-secondary btn-responsive disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || submitDisabled}
            className="btn-primary btn-responsive disabled:opacity-50"
          >
            {loading ? "Guardando..." : submitText}
          </button>
        </div>
      }
    >
      <div className="form-section">
        {children}
      </div>
    </ResponsiveModal>
  )
}

export function InfoModal({
  isOpen,
  onClose,
  title,
  children,
  closeText = "Cerrar",
  size = "md"
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  closeText?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-primary btn-responsive"
          >
            {closeText}
          </button>
        </div>
      }
    >
      {children}
    </ResponsiveModal>
  )
} 