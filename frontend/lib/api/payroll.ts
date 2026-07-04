import { api } from "./client";
import type { Payroll, PayrollUpdate } from "@/types";

export const getMyPayroll = (month?: string) =>
  api
    .get<Payroll[]>("/api/payroll/me", { params: { month } })
    .then((res) => res.data);

export const getPayrolls = (month?: string) =>
  api
    .get<Payroll[]>("/api/payroll", { params: { month } })
    .then((res) => res.data);

export const getEmployeePayroll = (employeeId: string, month?: string) =>
  api
    .get<Payroll[]>(`/api/payroll/${employeeId}`, { params: { month } })
    .then((res) => res.data);

export const updateEmployeePayroll = (
  employeeId: string,
  data: PayrollUpdate
) =>
  api
    .patch<Payroll>(`/api/payroll/${employeeId}`, data)
    .then((res) => res.data);
