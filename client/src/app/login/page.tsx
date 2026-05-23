'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/hooks/use-auth';
import { api } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    try {
      // Mock login for now, assuming external API is not yet built.
      // Replace with actual API call:
      // const res = await api.post('/auth/login', data);
      // login(res.data.user, res.data.token);

      // --- MOCK ---
      if (data.email === 'admin@admin.com') {
        login(
          { id: '1', name: 'Admin', email: data.email, role: 'admin' },
          'mock-jwt-token'
        );
        toast.success('Logged in successfully!');
        router.replace('/dashboard');
      } else if (data.email === 'member@member.com') {
        login(
          { id: '2', name: 'Member', email: data.email, role: 'member' },
          'mock-jwt-token'
        );
        toast.success('Logged in successfully!');
        router.replace('/user');
      } else {
        throw new Error('Use admin@admin.com or member@member.com to test');
      }
      // --- END MOCK ---
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
          <CardDescription>Enter your email below to log into your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="flex flex-col gap-4">
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@admin.com"
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </Field>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
