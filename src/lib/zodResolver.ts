import type { FieldValues, Resolver } from 'react-hook-form'
import type { ZodSchema, ZodError } from 'zod'

const formatErrors = (error: ZodError) => {
  const fieldErrors: Record<string, { type: string; message?: string }> = {}

  error.issues.forEach((issue) => {
    const path = issue.path.join('.') || 'root'
    fieldErrors[path] = {
      type: issue.code,
      message: issue.message,
    }
  })

  return fieldErrors
}

export const zodResolver = <TFieldValues extends FieldValues>(schema: ZodSchema<TFieldValues>): Resolver<TFieldValues> => async (
  values
) => {
  const result = schema.safeParse(values)

  if (result.success) {
    return {
      values: result.data,
      errors: {},
    }
  }

  return {
    values: {},
    errors: formatErrors(result.error) as any,
  }
}
