'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AxiosError } from 'axios';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import {
  ContactFormValues,
  contactSchema,
} from '@/app/home/ui/home-contact/parts/contact-schema';
import { Label } from '@/components/ui/label';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';

export function HomeContactForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitError(null);
    try {
      await api.post('/api/contact', data);
      setSuccess(true);
      reset();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response?.status === 429) {
        setSubmitError(
          error.response.data?.message ??
            'You can send one message every 15 minutes.',
        );
      } else {
        setSubmitError('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {success ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center gap-5 py-16 text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2
              className="w-20 h-20 text-primary"
              aria-hidden="true"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-2"
          >
            <h3 className="text-3xl font-semibold">Message sent!</h3>
            <p className="text-muted-foreground text-lg">
              Thanks for reaching out. I will get back to you as soon as I can.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => setSuccess(false)}
              className="mt-2 border-primary/30 cursor-pointer hover:border-primary/60 active:border-primary/60 hover:bg-primary/5 active:bg-primary/5 hover:text-primary active:text-primary"
            >
              Send another message
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
          noValidate
        >
          {/* honeypot */}
          <input
            type="text"
            autoComplete="off"
            tabIndex={-1}
            style={{ display: 'none' }}
            {...register('website')}
          />
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName" className="text-base font-medium">
                First name *
              </Label>
              <Input
                id="firstName"
                placeholder="Jane"
                className="h-12 text-base px-4"
                {...register('firstName')}
                aria-invalid={!!errors.firstName}
                aria-describedby={
                  errors.firstName ? 'firstName-error' : undefined
                }
              />
              {errors.firstName && (
                <p
                  id="firstName-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName" className="text-base font-medium">
                Last name *
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                className="h-12 text-base px-4"
                {...register('lastName')}
                aria-invalid={!!errors.lastName}
                aria-describedby={
                  errors.lastName ? 'lastName-error' : undefined
                }
              />
              {errors.lastName && (
                <p
                  id="lastName-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-base font-medium">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="jane.doe@email.com"
              className="h-12 text-base px-4"
              {...register('email')}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone" className="text-base font-medium">
              Phone{' '}
              <span className="text-muted-foreground text-sm font-normal">
                (optional)
              </span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+48 789 789 789"
              className="h-12 text-base px-4"
              {...register('phone')}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone && (
              <p
                id="phone-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.phone.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="message" className="text-base font-medium">
              Message *
            </Label>
            <Textarea
              id="message"
              placeholder="Tell me about the role, or just say hi..."
              rows={6}
              className="text-base px-4 py-3 resize-none"
              {...register('message')}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <p
                id="message-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.message.message}
              </p>
            )}
          </div>
          <AnimatePresence>
            {submitError && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-destructive text-center"
              >
                {submitError}
              </motion.p>
            )}
          </AnimatePresence>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-13 text-base gap-2 mt-1 cursor-pointer hover:bg-primary hover:scale-102 active:scale-102"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" aria-hidden="true" />
                Send message
              </>
            )}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
