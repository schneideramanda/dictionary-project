'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { initialValues, SignInForm, signInSchema } from '@/lib/schemas/auth';
import { useSignIn } from '@/hooks/useAuth';

export default function SignIn() {
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const { mutateAsync, isPending } = useSignIn();
  const onSubmit = async (data: SignInForm) => {
    try {
      await mutateAsync(data);
    } catch (error) {
      console.error('Sign-in error:', error);
    }
  };

  return (
    <div className="flex flex-1 min-h-[calc(100vh - 4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="sign-in-form" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="john@doe.com"
                      type="email"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="******"
                      type="password"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 mt-5">
          <Button
            type="submit"
            form="sign-in-form"
            className="w-full hover:bg-primary/80"
            disabled={!form.formState.isValid || isPending}>
            {isPending ? 'Signing in...' : 'Sign In'}
          </Button>
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
