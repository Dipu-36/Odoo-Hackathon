"use client";

import Link from "next/link";
import {
  Users,
  Clock,
  CheckCircle2,
  CalendarClock,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { LeaveStatusBadge } from "@/components/leave/LeaveStatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats, useApproveLeave } from "@/lib/hooks/useAdmin";
import { formatDate } from "@/lib/format";

export default function AdminDashboardPage() {
  const { counts, employees, leaves, attendance, isLoading } = useAdminStats();
  const approveLeave = useApproveLeave();

  const pendingLeaves = leaves.filter((l) => l.status === "PENDING").slice(0, 5);
  const recentEmployees = employees.slice(0, 5);

  const handleLeaveAction = (id: string, status: "APPROVED" | "REJECTED") => {
    approveLeave.mutate({ id, data: { status } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500">Overview of employees, attendance, leave, and payroll.</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Employees"
            value={counts.employees}
            icon={Users}
            subtitle="Registered workforce"
          />
          <StatCard
            title="Pending Leaves"
            value={counts.pendingLeaves}
            icon={Clock}
            subtitle="Awaiting approval"
          />
          <StatCard
            title="Approved Leaves"
            value={counts.approvedLeaves}
            icon={CheckCircle2}
            subtitle="This cycle"
          />
          <StatCard
            title="Checked-in Today"
            value={counts.checkedInToday}
            icon={CalendarClock}
            subtitle={`Out of ${counts.employees} employees`}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Pending Leave Requests"
          action={
            <Link href="/admin/leave">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          }
        >
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : pendingLeaves.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No pending leave requests.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {leave.type.replace("_", " ")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(leave.from)} – {formatDate(leave.to)}
                    </p>
                    {leave.remarks && (
                      <p className="text-xs text-slate-400">{leave.remarks}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleLeaveAction(leave.id, "APPROVED")}
                      disabled={approveLeave.isPending}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLeaveAction(leave.id, "REJECTED")}
                      disabled={approveLeave.isPending}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Today's Attendance"
          action={
            <Link href="/admin/attendance">
              <Button variant="ghost" size="sm" className="gap-1">
                Records <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          }
        >
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : attendance.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No check-ins recorded today.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {attendance.slice(0, 6).map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {record.userId}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(record.date)}
                    </p>
                  </div>
                  <LeaveStatusBadge
                    status={record.checkOut ? "APPROVED" : "PENDING"}
                  />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Recent Employees"
          action={
            <Link href="/admin/employees">
              <Button variant="ghost" size="sm" className="gap-1">
                Manage <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          }
        >
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : recentEmployees.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No employees found.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {emp.profile
                        ? `${emp.profile.firstName} ${emp.profile.lastName}`
                        : emp.email}
                    </p>
                    <p className="text-xs text-slate-500">
                      {emp.employeeId} • {emp.profile?.designation ?? "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Quick Links" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/admin/employees">
              <Button variant="outline" className="h-auto w-full justify-start p-4">
                <Users className="mr-3 h-5 w-5 text-slate-500" />
                <div className="text-left">
                  <p className="font-medium">Employees</p>
                  <p className="text-xs font-normal text-slate-500">
                    View and manage employee records
                  </p>
                </div>
              </Button>
            </Link>
            <Link href="/admin/attendance">
              <Button variant="outline" className="h-auto w-full justify-start p-4">
                <CalendarClock className="mr-3 h-5 w-5 text-slate-500" />
                <div className="text-left">
                  <p className="font-medium">Attendance</p>
                  <p className="text-xs font-normal text-slate-500">
                    Monitor daily and weekly attendance
                  </p>
                </div>
              </Button>
            </Link>
            <Link href="/admin/leave">
              <Button variant="outline" className="h-auto w-full justify-start p-4">
                <Clock className="mr-3 h-5 w-5 text-slate-500" />
                <div className="text-left">
                  <p className="font-medium">Leave Approvals</p>
                  <p className="text-xs font-normal text-slate-500">
                    Approve or reject leave requests
                  </p>
                </div>
              </Button>
            </Link>
            <Link href="/admin/payroll">
              <Button variant="outline" className="h-auto w-full justify-start p-4">
                <CheckCircle2 className="mr-3 h-5 w-5 text-slate-500" />
                <div className="text-left">
                  <p className="font-medium">Payroll</p>
                  <p className="text-xs font-normal text-slate-500">
                    Update salary structures
                  </p>
                </div>
              </Button>
            </Link>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
