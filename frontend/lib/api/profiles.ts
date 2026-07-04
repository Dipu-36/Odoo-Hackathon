import { api } from "./client";
import type { EmployeeProfile, User } from "@/types";

export interface MyProfileResponse {
  user: User;
  profile: EmployeeProfile | null;
}

export type UpdateProfileData = Partial<
  Pick<EmployeeProfile, "phone" | "department" | "designation" | "avatarUrl">
>;

export const getMyProfile = () =>
  api.get<MyProfileResponse>("/api/profiles/me").then((res) => res.data);

export const updateMyProfile = (data: UpdateProfileData) =>
  api.patch<MyProfileResponse>("/api/profiles/me", data).then((res) => res.data);
