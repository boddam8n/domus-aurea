const fallback = "invitation";

export function createInvitationSlug(brideName: string, groomName: string) {
  const base = `${brideName}-${groomName}`
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 54) || fallback;

  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}
