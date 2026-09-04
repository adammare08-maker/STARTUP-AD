# Gmail notifications for the public contact form

`POST /api/contact` validates and rate-limits each request, then stores it in the
Supabase `leads` table. The request remains visible in Adam's private workspace
even if the email notification fails.

The administrator authorizes the professional Gmail account from `/admin`.
The refresh token is encrypted server-side before it is stored in the private
`integration_credentials` table. Visitors and authenticated clients receive no
access to this table.

Required server variables: `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET`,
`GMAIL_REDIRECT_URI`, `GMAIL_TOKEN_ENCRYPTION_KEY`, and `CONTACT_TO_EMAIL`.
Secrets must never use the `NEXT_PUBLIC_` prefix or be committed to Git.

Run `supabase/migrations/004_gmail_notifications.sql` in the Supabase SQL Editor
before authorizing Gmail.
