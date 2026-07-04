"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserCircle, Shield, Landmark, Building2 } from "lucide-react";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useMyPayroll, useMyProfile, useUpdateProfile } from "@/lib/hooks/useEmployee";
import { formatCurrency, initials } from "@/lib/format";

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
  const currentMonth = new Date().toISOString().slice(0, 7);
  const { data: payroll = [], isLoading: payrollLoading } = useMyPayroll(currentMonth);
  const profile = data?.profile;
  const user = data?.user;
  const latestPayroll = payroll[payroll.length - 1];
  const showSalaryTab = user?.role === "ADMIN" || user?.role === "HR";

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

      <SectionCard title="Profile Summary">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col items-center gap-4 rounded-lg border bg-slate-50 p-5">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatarUrl ?? ""} />
              <AvatarFallback className="text-2xl">
                {isLoading ? (
                  <UserCircle className="h-10 w-10" />
                ) : (
                  initials(profile?.firstName, profile?.lastName)
                )}
              </AvatarFallback>
            </Avatar>

            {isLoading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              <div className="text-center">
                <p className="font-semibold text-slate-900">
                  {profile?.firstName} {profile?.lastName}
                </p>
                <p className="text-sm text-slate-500">{user?.employeeId}</p>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 grid gap-3 sm:grid-cols-2">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))
            ) : (
              <>
                <InfoTile label="Designation" value={profile?.designation ?? "—"} icon={UserCircle} />
                <InfoTile label="Department" value={profile?.department ?? "—"} icon={Building2} />
                <InfoTile label="Phone" value={profile?.phone ?? "—"} icon={Shield} />
                <InfoTile label="Employment Type" value="Full-time" icon={Landmark} />
                <InfoTile label="Employee ID" value={user?.employeeId ?? "—"} icon={UserCircle} />
                <InfoTile label="Status" value={user?.isVerified ? "Verified" : "Pending"} icon={Shield} />
              </>
            )}
          </div>
        </div>
      </SectionCard>

      <Tabs defaultValue="resume" className="w-full">
        <TabsList className="flex w-full justify-start overflow-x-auto rounded-lg bg-slate-100 p-1">
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="private">Private Info</TabsTrigger>
          {showSalaryTab && <TabsTrigger value="salary">Salary Info</TabsTrigger>}
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="resume">
          <SectionCard title="Resume / Basic Information">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full" />
                ))}
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
        </TabsContent>

        <TabsContent value="private">
          <SectionCard title="Private Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <ReadOnlyInput label="Date of Birth" value="—" />
              <ReadOnlyInput label="Nationality" value="—" />
              <ReadOnlyInput label="Gender" value="—" />
              <ReadOnlyInput label="Marital Status" value="—" />
              <ReadOnlyInput label="Personal Email" value="—" />
              <ReadOnlyInput label="Date of Joining" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"} />
              <div className="sm:col-span-2">
                <ReadOnlyInput label="Residing Address" value="—" />
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {showSalaryTab && (
          <TabsContent value="salary">
            <SectionCard title="Salary Information (Admin View)">
              {payrollLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : !latestPayroll ? (
                <p className="text-sm text-slate-500">No salary record available for this month.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <ReadOnlyInput label="Month Wage" value={formatCurrency(latestPayroll.basicSalary)} />
                  <ReadOnlyInput label="Net Salary" value={formatCurrency(latestPayroll.netSalary)} />
                  <ReadOnlyInput label="Allowances" value={formatCurrency(latestPayroll.allowances)} />
                  <ReadOnlyInput label="Deductions" value={formatCurrency(latestPayroll.deductions)} />
                </div>
              )}
            </SectionCard>
          </TabsContent>
        )}

        <TabsContent value="security">
          <SectionCard title="Security">
            <div className="grid gap-4 sm:grid-cols-2">
              <ReadOnlyInput label="Account Number" value="—" />
              <ReadOnlyInput label="Bank Name" value="—" />
              <ReadOnlyInput label="IFSC Code" value="—" />
              <ReadOnlyInput label="PAN Number" value="—" />
              <ReadOnlyInput label="UAN Number" value="—" />
              <ReadOnlyInput label="Employee Code" value={user?.employeeId ?? "—"} />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Sensitive fields are shown in read-only mode in this phase.
            </p>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

function ReadOnlyInput({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input value={value} disabled readOnly />
    </div>
  );
}

