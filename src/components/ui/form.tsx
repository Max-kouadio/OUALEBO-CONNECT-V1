import * as React from "react"
import {
  type FieldValues,
  type FieldPath,
  Controller,
  type ControllerProps,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"

const Form = FormProvider

const FormFieldContext = React.createContext<{ name: string } | undefined>(undefined)
const FormItemContext = React.createContext<{ id: string } | undefined>(undefined)

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const formContext = useFormContext()

  const fieldState = fieldContext
    ? formContext.getFieldState(fieldContext.name, formContext.formState)
    : undefined

  const id = React.useId()
  const formItemId = itemContext?.id ?? id

  return {
    name: fieldContext?.name,
    id: formItemId,
    formDescriptionId: `${formItemId}-description`,
    formMessageId: `${formItemId}-message`,
    error: fieldState?.error,
  }
}

function FormField<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  props: ControllerProps<TFieldValues, TName>
) {
  const { name, render, ...rest } = props

  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller
        name={name}
        render={(controllerProps) => render(controllerProps)}
        {...rest}
      />
    </FormFieldContext.Provider>
  )
}

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId()

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    const { id } = useFormField()

    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        htmlFor={id}
        {...props}
      />
    )
  }
)
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { id, formDescriptionId, formMessageId, error } = useFormField()

    if (React.isValidElement(children)) {
      return (
        <div className={cn("w-full", className)} ref={ref} {...props}>
          {React.cloneElement(children, {
            id,
            "aria-describedby": [formDescriptionId, formMessageId]
              .filter(Boolean)
              .join(" "),
            "aria-invalid": error ? true : undefined,
            ...children.props,
          })}
        </div>
      )
    }

    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        {children}
      </div>
    )
  }
)
FormControl.displayName = "FormControl"

const FormMessage = ({ className, children }: React.HTMLAttributes<HTMLParagraphElement>) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error.message ?? "Invalid value") : children

  if (!body) return null

  return (
    <p
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
    >
      {body}
    </p>
  )
}
FormMessage.displayName = "FormMessage"

export { Form, FormControl, FormField, FormItem, FormLabel, FormMessage }
