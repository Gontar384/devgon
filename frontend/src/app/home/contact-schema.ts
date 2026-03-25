import { z } from 'zod';

export const contactSchema = z.object({
  firstName: z.string().min(2, 'Imię musi mieć co najmniej 2 znaki').max(100),
  lastName: z
    .string()
    .min(2, 'Nazwisko musi mieć co najmniej 2 znaki')
    .max(100),
  email: z.email('Nieprawidłowy adres email'),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, 'Nieprawidłowy numer telefonu')
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .min(10, 'Wiadomość musi mieć co najmniej 10 znaków')
    .max(2000, 'Wiadomość może mieć maksymalnie 2000 znaków'),
  website: z.string().optional(), // honeypot
});

export type ContactFormValues = z.infer<typeof contactSchema>;
