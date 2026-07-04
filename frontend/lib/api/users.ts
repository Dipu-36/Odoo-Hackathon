import { api } from "./client";
import type { UserWithProfile } from "@/types";

export const getUsers = () =>
  api.get<UserWithProfile[]>("/api/users").then((res) => res.data);
