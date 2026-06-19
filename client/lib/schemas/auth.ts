import { z } from 'zod';

export const initialValues: SignInForm = {
  email: '',
  password: '',
};

export const signInSchema = z.object({
  email: z.email().min(1, { message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type SignInForm = z.infer<typeof signInSchema>;
