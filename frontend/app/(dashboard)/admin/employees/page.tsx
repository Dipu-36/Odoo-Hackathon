"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useEmployees } from "@/lib/hooks/useAdmin";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { initials, formatDate } from "@/lib/format";
import type { UserWithProfile } from "@/types";

export default function AdminEmployeesPage() {
  const { data: employees = [], isLoading } = useEmployees();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<UserWithProfile | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((emp) => {
      const fullName = emp.profile
        ? `${emp.profile.firstName} ${emp.profile.lastName}`.toLowerCase()
        : "";
      return (
        fullName.includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.employeeId.toLowerCase().includes(q) ||
        emp.profile?.department?.toLowerCase().includes(q) ||
        emp.profile?.designation?.toLowerCase().includes(q)
      );
    });
  }, [employees, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-500">Manage and view all employee records.</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search by name, ID, email, department..."
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableEmpty colSpan={6}>No employees found.</TableEmpty>
            ) : (
              filtered.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {emp.profile?.avatarUrl && (
                          <AvatarImage src={emp.profile.avatarUrl} />
                        )}
                        <AvatarFallback>
                          {initials(
                            emp.profile?.firstName,
                            emp.profile?.lastName
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">
                          {emp.profile
                            ? `${emp.profile.firstName} ${emp.profile.lastName}`
                            : emp.email}
                        </p>
                        <p className="text-xs text-slate-500">{emp.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{emp.employeeId}</TableCell>
                  <TableCell>{emp.profile?.department ?? "—"}</TableCell>
                  <TableCell>{emp.profile?.designation ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{emp.role}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelected(emp)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && (
          <>
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
              <DialogDescription>
                Full record for {selected.profile?.firstName ?? selected.email}.
              </DialogDescription>
              <DialogClose onClick={() => setSelected(null)} />
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500">Employee ID</p>
                  <p className="font-medium">{selected.employeeId}</p>
                </div>
                <div>
                  <p className="text-slate-500">Email</p>
                  <p className="font-medium">{selected.email}</p>
                </div>
                <div>
                  <p className="text-slate-500">Role</p>
                  <p className="font-medium">{selected.role}</p>
                </div>
                <div>
                  <p className="text-slate-500">Verified</p>
                  <p className="font-medium">
                    {selected.isVerified ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Phone</p>
                  <p className="font-medium">
                    {selected.profile?.phone ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Joined</p>
                  <p className="font-medium">
                    {formatDate(selected.createdAt)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-slate-500">Department / Designation</p>
                <p className="font-medium">
                  {selected.profile?.department ?? "—"} /{" "}
                  {selected.profile?.designation ?? "—"}
                </p>
              </div>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
