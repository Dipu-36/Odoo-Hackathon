// Shared TypeScript types aligned with the PostgreSQL schema

export type Role = "ADMIN" | "HR" | "EMPLOYEE";

export interface User {
  id: string;
  employeeId: string;
  email: string;
  role: Role;
  isVerified: boolean;
  createdAt: string;
}

export interface EmployeeProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  department?: string;
  designation?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  checkIn: string;
  checkOut?: string;
  date: string;
}

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";
export type LeaveType = "CASUAL" | "SICK" | "EARNED" | "UNPAID";

export interface LeaveRequest {
  id: string;
  userId: string;
  type: LeaveType;
  from: string;
  to: string;
  remarks?: string;
  status: LeaveStatus;
  createdAt: string;
}

export interface Payroll {
  id: string;
  userId: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  month: string; // "YYYY-MM"
  updatedAt: string;
}
