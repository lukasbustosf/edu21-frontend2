'use client'

import { Fragment, ReactNode, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface ResponsiveModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  footer?: ReactNode
  className?: string
  mobileFullScreen?: boolean // Force full screen on mobile
  preventScroll?: boolean
}

export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
  className,
  mobileFullScreen = false,
  preventScroll = true
}: ResponsiveModalProps) {
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!preventScroll) return
    
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Prevent scroll on iOS
      document.documentElement.style.position = 'fixed'
      document.documentElement.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.position = ''
      document.documentElement.style.width = ''
    }
    
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.position = ''
      document.documentElement.style.width = ''
    }
  }, [isOpen, preventScroll])

  const getSizeClasses = () => {
    if (mobileFullScreen) {
      return 'w-full h-full sm:w-auto sm:h-auto sm:max-w-lg sm:max-h-[90vh] md:max-w-xl lg:max-w-2xl xl:max-w-4xl'
    }

    switch (size) {
      case 'sm':
        return 'modal-panel-sm'
      case 'md':
        return 'modal-panel'
      case 'lg':
        return 'modal-panel-lg'
      case 'xl':
      case 'full':
        return 'modal-panel-full'
      default:
        return 'modal-panel'
    }
  }

  const getContentClasses = () => {
    if (mobileFullScreen) {
      return 'h-full sm:h-auto flex flex-col sm:block'
    }
    return 'max-h-[90vh] sm:max-h-[80vh] flex flex-col'
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="modal-container" 
        onClose={closeOnOverlayClick ? onClose : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="modal-backdrop" />
        </Transition.Child>

        <div className="modal-wrapper safe-area-inset">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className={cn(getSizeClasses(), className)}>
              <div className={getContentClasses()}>
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white rounded-t-lg">
                    {title && (
                      <Dialog.Title as="h3" className="page-title text-mobile-lg sm:text-xl lg:text-2xl">
                        {title}
                      </Dialog.Title>
                    )}
                    {showCloseButton && (
                      <button
                        type="button"
                        className="-m-2 p-2 text-gray-400 hover:text-gray-600 touch-manipulation rounded-full hover:bg-gray-100"
                        onClick={onClose}
                      >
                        <span className="sr-only">Cerrar</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
                  {children}
                </div>

                {/* Footer */}
                {footer && (
                  <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 sm:bg-white rounded-b-lg mobile-sticky-bottom mobile-safe-bottom">
                    {footer}
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
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
            className={cn(buttonClass, "btn-responsive disabled:opacity-50")}
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
  children: ReactNode
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
  children: ReactNode
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