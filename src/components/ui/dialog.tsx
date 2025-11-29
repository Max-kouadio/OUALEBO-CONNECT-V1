import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

interface DialogContextValue {
  onOpenChange?: (open: boolean) => void
}

const DialogContext = createContext<DialogContextValue>({})

interface DialogProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null

  return (
    <DialogContext.Provider value={{ onOpenChange }}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-10"
        role="presentation"
        onClick={() => onOpenChange?.(false)}
      >
        <div
          className="relative w-full max-w-lg"
          role="dialog"
          aria-modal="true"
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </DialogContext.Provider>
  )
}

interface DialogContentProps {
  children: ReactNode
  className?: string
}

export function DialogContent({ children, className }: DialogContentProps) {
  return (
    <div className={cn('bg-white rounded-lg shadow-xl border p-6', className)}>
      {children}
    </div>
  )
}

interface DialogHeaderProps {
  children: ReactNode
  className?: string
}

export function DialogHeader({ children, className }: DialogHeaderProps) {
  return <div className={cn('space-y-2', className)}>{children}</div>
}

interface DialogTitleProps {
  children: ReactNode
  className?: string
}

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <h2 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
      {children}
    </h2>
  )
}

interface DialogDescriptionProps {
  children: ReactNode
  className?: string
}

export function DialogDescription({ children, className }: DialogDescriptionProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
  )
}

export function useDialogContext() {
  return useContext(DialogContext)
}
