import { z } from 'zod';

export const contactSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(100),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(100),
  email: z.email('Invalid email address'),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message can be at most 2000 characters'),
  website: z.string().optional(), // honeypot
});

export type ContactFormValues = z.infer<typeof contactSchema>;
