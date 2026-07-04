"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserCircle } from "lucide-react";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMyProfile, useUpdateProfile } from "@/lib/hooks/useEmployee";
import { initials } from "@/lib/format";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  phone: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function EmployeeProfilePage() {
  const { data, isLoading } = useMyProfile();
  const { mutate, isPending, error, isSuccess } = useUpdateProfile();
  const profile = data?.profile;
  const user = data?.user;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone ?? "",
        department: profile.department ?? "",
        designation: profile.designation ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = (values: FormValues) => mutate(values);

  const field = (id: keyof FormValues, label: string, placeholder = "") => (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} placeholder={placeholder} {...register(id)} />
      {errors[id] && <p className="text-xs text-red-500">{errors[id]?.message}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar card */}
        <SectionCard title="Photo">
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatarUrl ?? ""} />
              <AvatarFallback className="text-2xl">
                {isLoading ? <UserCircle className="h-10 w-10" /> : initials(profile?.firstName, profile?.lastName)}
              </AvatarFallback>
            </Avatar>
            {isLoading ? (
              <Skeleton className="h-5 w-32" />
            ) : (
              <div className="text-center">
                <p className="font-semibold">{profile?.firstName} {profile?.lastName}</p>
                <p className="text-sm text-slate-500">{user?.employeeId}</p>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Edit form */}
        <div className="lg:col-span-2">
          <SectionCard title="Personal Information">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {field("firstName", "First Name", "John")}
                  {field("lastName", "Last Name", "Doe")}
                </div>
                {field("phone", "Phone", "+1 234 567 890")}
                {field("department", "Department", "Engineering")}
                {field("designation", "Designation", "Software Engineer")}

                {error && (
                  <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
                    Failed to update profile. Please try again.
                  </p>
                )}
                {isSuccess && (
                  <p className="rounded bg-green-50 px-3 py-2 text-sm text-green-700">
                    Profile updated successfully.
                  </p>
                )}

                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving…" : "Save Changes"}
                </Button>
              </form>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

