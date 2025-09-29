/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export type Gender = "male" | "female" | "any";

export type SeverityLevel = "critical" | "moderate" | "low";

export interface VaccineRecommendation {
  id: string;
  age: number;
  gender: Gender;
  vaccine: string;
  disease: string;
  severity: SeverityLevel;
  notes?: string;
}

export interface VaccinesResponse {
  upcoming: VaccineRecommendation[];
  recent: VaccineRecommendation[];
}

export interface ReminderPayload {
  userId: string;
  memberId?: string;
  vaccineId: string;
  scheduledAt?: string;
}

export interface ReminderRecord extends ReminderPayload {
  id: string;
  createdAt: string;
}

export interface FamilyMemberPayload {
  name: string;
  age: number;
  gender: Gender;
}

export interface FamilyMemberRecord extends FamilyMemberPayload {
  id: string;
  createdAt: string;
}
