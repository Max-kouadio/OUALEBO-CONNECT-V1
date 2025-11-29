import * as React from "react"

import { cn } from "@/lib/utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string
}

interface SelectValueProps {
  placeholder?: string
}

interface SelectContentProps {
  children: React.ReactNode
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

const SelectTrigger = (_props: SelectTriggerProps) => null
const SelectValue = (_props: SelectValueProps) => null
const SelectContent = ({ children }: SelectContentProps) => <>{children}</>
const SelectItem = (_props: SelectItemProps) => null

function extractOptions(children: React.ReactNode) {
  const options: SelectItemProps[] = []
  let placeholder: string | undefined
  let triggerProps: SelectTriggerProps | undefined

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return

    if (child.type === SelectTrigger) {
      triggerProps = child.props

      React.Children.forEach(child.props.children, (triggerChild) => {
        if (
          React.isValidElement<SelectValueProps>(triggerChild) &&
          triggerChild.type === SelectValue
        ) {
          placeholder = triggerChild.props.placeholder
        }
      })
    }

    if (child.type === SelectContent) {
      React.Children.forEach(child.props.children, (contentChild) => {
        if (
          React.isValidElement<SelectItemProps>(contentChild) &&
          contentChild.type === SelectItem
        ) {
          options.push({
            value: contentChild.props.value,
            children: contentChild.props.children,
          })
        }
      })
    }
  })

  return { options, placeholder, triggerProps }
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    children,
    className,
    defaultValue,
    value,
    onValueChange,
    disabled,
    onChange,
    ...props
  }, ref) => {
    const { options, placeholder, triggerProps } = React.useMemo(
      () => extractOptions(children),
      [children]
    )

    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
    const currentValue = value ?? internalValue

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setInternalValue(event.target.value)
      onValueChange?.(event.target.value)
      onChange?.(event)
    }

    return (
      <select
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          triggerProps?.className,
          className
        )}
        value={currentValue}
        onChange={handleChange}
        id={triggerProps?.id ?? props.id}
        disabled={disabled}
        {...props}
      >
        {placeholder && currentValue === "" && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.children}
          </option>
        ))}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
