import { z } from 'zod';

export const signInInitialValues: SignInForm = {
  email: '',
  password: '',
};

export const signInSchema = z.object({
  email: z.email().min(1, { message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type SignInForm = z.infer<typeof signInSchema>;

export const signUpInitialValues: SignUpForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const signUpSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.email().min(1, { message: 'Email is required' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignUpForm = z.infer<typeof signUpSchema>;
