import { z } from 'zod'

// Shared schemas
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(24, 'Username must be less than 24 characters')
  .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores')

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
