import { z } from 'zod'

// Shared schemas
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be 30 characters or fewer')
  .regex(/^[a-z0-9._]{3,30}$/, 'Only lowercase letters, numbers, dots, and underscores are allowed')
  .refine((u) => !/__/.test(u), 'Underscores cannot appear consecutively (__)')
  .refine((u) => !(/\.\./.test(u)), 'Dots cannot appear consecutively (..)')
  .refine((u) => !/^[._]/.test(u), 'Username cannot start with a dot or underscore')
  .refine((u) => !/[._]$/.test(u), 'Username cannot end with a dot or underscore')


// Auth schemas
export const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

// Profile schemas
export const profileSchema = z.object({
  username: usernameSchema,
})

// Link schemas
export const linkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  // Next.js URL validation + explicit protocol check to prevent javascript: XSS
  url: z.string().url('Please enter a valid URL').refine(
    (val) => {
      try {
        const urlObj = new URL(val)
        return ['http:', 'https:'].includes(urlObj.protocol)
      } catch {
        return false
      }
    },
    { message: 'URL must start with http:// or https://' }
  ),
})
