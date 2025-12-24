import { z } from 'zod';

// Booking reference: 6 alphanumeric characters
export const bookingReferenceSchema = z
  .string()
  .min(1, 'Booking reference is required')
  .max(6, 'Booking reference must be 6 characters')
  .regex(/^[A-Z0-9]{1,6}$/, 'Booking reference must be alphanumeric')
  .transform((val) => val.toUpperCase());

// Last name: letters, hyphens, apostrophes, spaces only
export const lastNameSchema = z
  .string()
  .min(1, 'Last name is required')
  .max(50, 'Last name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
  .transform((val) => val.trim());

// Email with stricter validation
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .max(255, 'Email must be less than 255 characters')
  .email('Please enter a valid email address')
  .transform((val) => val.toLowerCase().trim());

// Price: positive number
export const priceSchema = z
  .number()
  .positive('Price must be greater than 0')
  .max(100000, 'Price cannot exceed 100,000');

// Airport code: 3 uppercase letters
export const airportCodeSchema = z
  .string()
  .length(3, 'Airport code must be 3 characters')
  .regex(/^[A-Z]{3}$/, 'Airport code must be 3 uppercase letters');

// Airport/Location name
export const locationNameSchema = z
  .string()
  .min(1, 'Location name is required')
  .max(200, 'Location name must be less than 200 characters')
  .transform((val) => val.trim());

// Success result type
export type ValidationSuccess<T> = { success: true; data: T };
// Error result type  
export type ValidationError = { success: false; error: string };
// Combined result type
export type ValidationResult<T> = ValidationSuccess<T> | ValidationError;

// Validate and return result with error message
export function validateWithMessage<T>(
  schema: z.ZodSchema<T>,
  value: unknown
): ValidationResult<T> {
  const result = schema.safeParse(value);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const firstError = result.error.issues[0];
  return { success: false, error: firstError?.message || 'Validation failed' };
}

// Helper to check if result is an error (type guard)
export function isValidationError<T>(result: ValidationResult<T>): result is ValidationError {
  return !result.success;
}
