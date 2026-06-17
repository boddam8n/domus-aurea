import { z } from "zod";

export const invitationRequestSchema = z.object({
  brideName: z.string().trim().min(2, "Bride name is required").max(80),
  groomName: z.string().trim().min(2, "Groom name is required").max(80),
  weddingDate: z.string().trim().min(6, "Wedding date is required").max(80),
  venue: z.string().trim().min(2, "Venue is required").max(140),
  phone: z.string().trim().min(7, "WhatsApp number is required").max(32),
  templateName: z.string().trim().min(2).max(80),
  packageName: z.string().trim().min(2).max(80),
  countdownStyle: z.string().trim().min(2).max(80),
  musicFileName: z.string().trim().max(160).optional()
});

export const rsvpSchema = z.object({
  guestName: z.string().trim().min(2, "Guest name is required").max(100),
  response: z.enum(["accepted", "declined"])
});

export type InvitationRequestInput = z.infer<typeof invitationRequestSchema>;
export type RsvpInput = z.infer<typeof rsvpSchema>;
