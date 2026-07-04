import { api } from "./client";
import type { User } from "@/types";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  employeeId: string;
  email: string;
  password: string;
  role: "ADMIN" | "HR" | "EMPLOYEE";
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export const login = (data: LoginData) =>
  api.post<LoginResponse>("/api/auth/login", data).then((res) => res.data);

export const register = (data: RegisterData) =>
  api.post<Omit<User, "isVerified">>("/api/auth/register", data).then((res) => res.data);

export const verifyAccount = (token: string) =>
  api.get<{ message: string }>("/api/auth/verify", { params: { token } }).then((res) => res.data);
