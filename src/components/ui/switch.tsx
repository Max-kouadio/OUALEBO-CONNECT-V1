import * as React from 'react'
import { cn } from '@/lib/utils'

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <label className={cn('relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition', checked ? 'bg-royal-burgundy' : 'bg-gray-300', className)}>
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition',
            checked ? 'translate-x-5' : 'translate-x-1'
          )}
        />
      </label>
    )
  }
)

Switch.displayName = 'Switch'
