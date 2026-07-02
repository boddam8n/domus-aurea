import { z } from "zod";

export const invitationRequestSchema = z.object({
  brideName: z.string().trim().min(2, "Bride name is required").max(80),
  groomName: z.string().trim().min(2, "Groom name is required").max(80),
  weddingDate: z.string().trim().min(6, "Wedding date is required").max(80),
  venue: z.string().trim().min(2, "Venue is required").max(140),
  venueAddress: z.string().trim().max(260).optional(),
  venueLat: z.number().min(-90).max(90).optional(),
  venueLng: z.number().min(-180).max(180).optional(),
  phone: z.string().trim().min(7, "WhatsApp number is required").max(32),
  templateName: z
    .string()
    .trim()
    .refine(
      (value) => ["TEST INVITATION", "Domus Aurea Invitation"].includes(value),
      "Domus Aurea Invitation is the only launch-ready template."
    ),
  packageName: z.string().trim().min(2).max(80),
  countdownStyle: z.string().trim().min(2).max(80),
  musicFileName: z.string().trim().max(160).optional(),
  sealImageUrl: z
    .string()
    .trim()
    .max(750000, "Seal image is too large")
    .refine((value) => !value || value.startsWith("data:image/png;base64,"), "Seal image must be a transparent PNG data URL.")
    .optional()
});

export const rsvpSchema = z.object({
  guestName: z.string().trim().min(2, "Guest name is required").max(100),
  response: z.enum(["accepted", "declined"])
});

export type InvitationRequestInput = z.infer<typeof invitationRequestSchema>;
export type RsvpInput = z.infer<typeof rsvpSchema>;
