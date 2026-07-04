"use client";

import { useEffect, useMemo, useState } from "react";
import { useEmployees, usePayrolls, useUpdatePayroll } from "@/lib/hooks/useAdmin";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/format";
import type { Payroll, UserWithProfile } from "@/types";

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

interface PayrollRow {
  employee: UserWithProfile;
  payroll?: Payroll;
}

export default function AdminPayrollPage() {
  const { data: employees = [], isLoading: loadingEmployees } = useEmployees();
  const [month, setMonth] = useState(currentMonth());
  const { data: payrolls = [], isLoading: loadingPayrolls } = usePayrolls(month);
  const updatePayroll = useUpdatePayroll();

  const [dialog, setDialog] = useState<{
    employee: UserWithProfile;
    payroll?: Payroll;
  } | null>(null);

  const [form, setForm] = useState({
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
  });

  useEffect(() => {
    if (dialog) {
      setForm({
        basicSalary: dialog.payroll?.basicSalary ?? 0,
        allowances: dialog.payroll?.allowances ?? 0,
        deductions: dialog.payroll?.deductions ?? 0,
      });
    }
  }, [dialog]);

  const rows: PayrollRow[] = useMemo(() => {
    const byUser = new Map(payrolls.map((p) => [p.userId, p]));
    return employees.map((employee) => ({
      employee,
      payroll: byUser.get(employee.id),
    }));
  }, [employees, payrolls]);

  const netSalary = useMemo(
    () => form.basicSalary + form.allowances - form.deductions,
    [form]
  );

  const handleSave = () => {
    if (!dialog) return;
    updatePayroll.mutate(
      {
        employeeId: dialog.employee.id,
        data: { ...form, netSalary, month },
      },
      { onSuccess: () => setDialog(null) }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payroll Management</h1>
          <p className="text-slate-500">View and update employee salary structures.</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Month
          </label>
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-48"
          />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Basic Salary</TableHead>
              <TableHead>Allowances</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Salary</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingEmployees || loadingPayrolls ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableEmpty colSpan={6}>No employees found.</TableEmpty>
            ) : (
              rows.map(({ employee, payroll }) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    {employee.profile
                      ? `${employee.profile.firstName} ${employee.profile.lastName}`
                      : employee.email}
                    <p className="text-xs text-slate-500">{employee.employeeId}</p>
                  </TableCell>
                  <TableCell>
                    {payroll ? formatCurrency(payroll.basicSalary) : "—"}
                  </TableCell>
                  <TableCell>
                    {payroll ? formatCurrency(payroll.allowances) : "—"}
                  </TableCell>
                  <TableCell>
                    {payroll ? formatCurrency(payroll.deductions) : "—"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {payroll ? formatCurrency(payroll.netSalary) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDialog({ employee, payroll })}
                    >
                      {payroll ? "Edit" : "Set Salary"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!dialog} onOpenChange={() => setDialog(null)}>
        {dialog && (
          <>
            <DialogHeader>
              <DialogTitle>Update Salary Structure</DialogTitle>
              <DialogDescription>
                {dialog.employee.profile
                  ? `${dialog.employee.profile.firstName} ${dialog.employee.profile.lastName}`
                  : dialog.employee.email}{" "}
                – {month}
              </DialogDescription>
              <DialogClose onClick={() => setDialog(null)} />
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="basic">Basic Salary</Label>
                <Input
                  id="basic"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.basicSalary}
                  onChange={(e) =>
                    setForm({ ...form, basicSalary: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="allowances">Allowances</Label>
                <Input
                  id="allowances"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.allowances}
                  onChange={(e) =>
                    setForm({ ...form, allowances: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="deductions">Deductions</Label>
                <Input
                  id="deductions"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.deductions}
                  onChange={(e) =>
                    setForm({ ...form, deductions: Number(e.target.value) })
                  }
                />
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-sm text-slate-500">Calculated Net Salary</p>
                <p className="text-lg font-semibold text-slate-900">
                  {formatCurrency(netSalary)}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialog(null)}
                disabled={updatePayroll.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updatePayroll.isPending || netSalary < 0}
              >
                {updatePayroll.isPending ? "Saving..." : "Save Payroll"}
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </div>
  );
}
