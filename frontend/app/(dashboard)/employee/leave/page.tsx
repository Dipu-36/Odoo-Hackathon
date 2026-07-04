"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { LeaveStatusBadge } from "@/components/leave/LeaveStatusBadge";
import {
  Table, TableBody, TableCell, TableEmpty,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useMyLeave, useCreateLeave } from "@/lib/hooks/useEmployee";
import { formatDate } from "@/lib/format";
import type { LeaveType } from "@/types";

const schema = z.object({
  type: z.enum(["CASUAL", "SICK", "EARNED", "UNPAID"]),
  from: z.string().min(1, "Required"),
  to: z.string().min(1, "Required"),
  remarks: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function EmployeeLeavePage() {
  const [open, setOpen] = useState(false);
  const { data: leaves = [], isLoading } = useMyLeave();
  const { mutate, isPending, error, reset: resetMutation } = useCreateLeave();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "CASUAL" },
  });

  const onSubmit = (values: FormValues) => {
    mutate(
      { ...values, type: values.type as LeaveType },
      {
        onSuccess: () => {
          reset();
          resetMutation();
          setOpen(false);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Leave Requests</h1>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> New Request
        </Button>
      </div>

      <SectionCard title="My Requests">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.length === 0 && (
                <TableEmpty colSpan={6}>No leave requests yet. Click &apos;New Request&apos; to apply.</TableEmpty>
              )}
              {leaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell className="capitalize font-medium">{leave.type.toLowerCase()}</TableCell>
                  <TableCell>{formatDate(leave.from)}</TableCell>
                  <TableCell>{formatDate(leave.to)}</TableCell>
                  <TableCell className="text-slate-500">{leave.remarks ?? "—"}</TableCell>
                  <TableCell><LeaveStatusBadge status={leave.status} /></TableCell>
                  <TableCell>{formatDate(leave.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>

      {/* New leave dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Leave Type</Label>
              <select
                {...register("type")}
                className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="CASUAL">Casual</option>
                <option value="SICK">Sick</option>
                <option value="EARNED">Earned</option>
                <option value="UNPAID">Unpaid</option>
              </select>
              {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="from">From</Label>
                <Input id="from" type="date" {...register("from")} />
                {errors.from && <p className="text-xs text-red-500">{errors.from.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="to">To</Label>
                <Input id="to" type="date" {...register("to")} />
                {errors.to && <p className="text-xs text-red-500">{errors.to.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="remarks">Remarks (optional)</Label>
              <Input id="remarks" placeholder="Reason for leave…" {...register("remarks")} />
            </div>

            {error && (
              <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
                {(error as any)?.response?.data?.message ?? "Failed to submit. Try again."}
              </p>
            )}

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                <X className="mr-1 h-4 w-4" /> Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Submitting…" : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
      </Dialog>
    </div>
  );
}

