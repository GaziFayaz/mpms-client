'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const memberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  role: z.string().min(1, 'Role is required'),
  department: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function CreateTeamMemberPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: { role: 'Developer' },
  });

  const roleValue = watch('role');
  const roleOptions = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Manager', value: 'Manager' },
    { label: 'Developer', value: 'Developer' },
    { label: 'Designer', value: 'Designer' },
    { label: 'QA', value: 'QA' },
  ];

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Team member added successfully');
      router.push('/dashboard/team');
    } catch {
      toast.error('Failed to add team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Team Member</h1>
        <p className="text-muted-foreground">Add a new member to your team.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="flex flex-col gap-4">
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input id="name" placeholder="John Doe" aria-invalid={!!errors.name} {...register('name')} />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="john@example.com" aria-invalid={!!errors.email} {...register('email')} />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <Select items={roleOptions} value={roleValue} onValueChange={(val: any) => setValue('role', val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roleOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="department">Department</FieldLabel>
                  <Input id="department" placeholder="Engineering" {...register('department')} />
                </Field>
              </div>

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" placeholder="Min 6 characters" aria-invalid={!!errors.password} {...register('password')} />
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </Field>

              <div className="flex justify-end gap-4">
                <Button render={<Link href="/dashboard/team" />} nativeButton={false} variant="outline">Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Member'}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
