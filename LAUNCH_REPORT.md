# Domus Aurea Launch Report

## Features Completed

- Supabase-ready customer authentication with sign up and sign in pages.
- Customer dashboard at `/dashboard`.
- Invitation creation flow at `/design`.
- Unique public invitation URLs at `/invitation/[slug]`.
- Copy public link button in the dashboard and after creation.
- Guest RSVP with accept/decline responses.
- Device/browser duplicate RSVP prevention with HTTP-only cookies.
- Invitation view tracking and unique visitor analytics.
- Arabic-first labels added to the core launch flow.
- Legacy static files archived under `archive/legacy-static`.
- Legacy brand references removed from active code.
- Zod validation added for invitation creation and RSVP.
- Supabase schema added at `supabase/schema.sql`.
- Local image assets converted to WebP and referenced by active pages.
- `npm run build` equivalent completed successfully with no critical build errors.

## Database Schema

- `profiles`: customer profile linked to `auth.users`.
- `invitations`: customer invitation records, public slug, wedding details, package and template.
- `guest_responses`: guest name, accept/decline status, device id, unique per invitation/device.
- `invitation_analytics`: public invitation view events and visitor ids.

## Required Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
```

## Deployment Steps

1. Create Supabase project.
2. Run `supabase/schema.sql`.
3. Add the environment variables in Vercel or `.env.local`.
4. Deploy the Next.js app to Vercel.
5. Test sign up, sign in, create invitation, public link, RSVP, and dashboard analytics.

## Remaining Production Issues

- Supabase environment variables must be configured before production testing.
- Email confirmation behavior depends on Supabase Auth settings.
- Image assets are still stored locally; a CDN or Supabase Storage can be added later.
- NPM audit currently reports 5 vulnerabilities in the dependency tree. Review before public launch.
- Mobile menu button is present visually but does not open a drawer yet.
- Production Supabase end-to-end behavior still needs testing with real deployed environment variables.

## Ready For Production

NO.

The product is structurally ready for a launch candidate, but it needs real Supabase credentials, database migration execution, full end-to-end testing on the deployed domain, and dependency audit review before public launch.
