# Domus Aurea Deployment

## Required Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Enable Email/Password auth in Authentication > Providers.
5. Copy the project URL, anon key, and service role key.

## Deploy To Vercel

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Add the environment variables above.
4. Set `NEXT_PUBLIC_SITE_URL` to the final domain.
5. Deploy.
6. Test `/auth/sign-up`, `/design`, `/dashboard`, and a generated `/invitation/[slug]` URL.

## Deploy To A VPS

1. Install Node.js 20+.
2. Clone the repository.
3. Run `npm ci`.
4. Create `.env.local` from `.env.example`.
5. Run `npm run build`.
6. Run `npm run start`.
7. Put Nginx/Caddy in front of port `3000`.
8. Add HTTPS with Let's Encrypt.

## Public Invitation Flow

1. Customer signs up or signs in.
2. Customer opens `/design`.
3. Customer enters wedding details and creates the invitation.
4. The app saves the invitation in Supabase and generates `/invitation/[slug]`.
5. Customer copies the link from `/dashboard`.
6. Guest opens the link, opens the envelope, and submits RSVP.
7. Dashboard updates views, unique visitors, accepted guests, declined guests, and guest list.
