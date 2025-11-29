import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

interface AlertDialogContextValue {
  onOpenChange?: (open: boolean) => void
}

const AlertDialogContext = createContext<AlertDialogContextValue>({})

interface AlertDialogProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  if (!open) return null

  return (
    <AlertDialogContext.Provider value={{ onOpenChange }}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-10"
        role="presentation"
        onClick={() => onOpenChange?.(false)}
      >
        <div
          className="relative w-full max-w-lg"
          role="alertdialog"
          aria-modal="true"
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </AlertDialogContext.Provider>
  )
}

interface AlertDialogContentProps {
  children: ReactNode
  className?: string
}

export function AlertDialogContent({ children, className }: AlertDialogContentProps) {
  return (
    <div className={cn('bg-white rounded-lg shadow-xl border p-6', className)}>
      {children}
    </div>
  )
}

interface AlertDialogHeaderProps {
  children: ReactNode
  className?: string
}

export function AlertDialogHeader({ children, className }: AlertDialogHeaderProps) {
  return <div className={cn('space-y-2', className)}>{children}</div>
}

interface AlertDialogFooterProps {
  children: ReactNode
  className?: string
}

export function AlertDialogFooter({ children, className }: AlertDialogFooterProps) {
  return (
    <div className={cn('mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 sm:space-y-0', className)}>
      {children}
    </div>
  )
}

interface AlertDialogTitleProps {
  children: ReactNode
  className?: string
}

export function AlertDialogTitle({ children, className }: AlertDialogTitleProps) {
  return (
    <h2 className={cn('text-xl font-semibold leading-none tracking-tight', className)}>
      {children}
    </h2>
  )
}

interface AlertDialogDescriptionProps {
  children: ReactNode
  className?: string
}

export function AlertDialogDescription({ children, className }: AlertDialogDescriptionProps) {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
}

interface AlertDialogActionProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function AlertDialogAction({ children, className, onClick }: AlertDialogActionProps) {
  const { onOpenChange } = useAlertDialogContext()

  const handleClick = () => {
    onClick?.()
    onOpenChange?.(false)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
        className
      )}
    >
      {children}
    </button>
  )
}

interface AlertDialogCancelProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function AlertDialogCancel({ children, className, onClick }: AlertDialogCancelProps) {
  const { onOpenChange } = useAlertDialogContext()

  const handleClick = () => {
    onClick?.()
    onOpenChange?.(false)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
        className
      )}
    >
      {children}
    </button>
  )
}

export function useAlertDialogContext() {
  return useContext(AlertDialogContext)
}
