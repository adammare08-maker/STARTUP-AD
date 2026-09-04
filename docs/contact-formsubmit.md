# Public homepage contact form

The public `/api/contact` route validates and rate-limits incoming requests before
inserting a lead in Supabase. It works without a login and with an admin login.
No account ownership is inferred from an email address. Existing RLS is unchanged.
Adam can read the full submission under Admin → Prospects récents → Lire la demande.

Only after successful storage does the server submit the contact fields to
FormSubmit AJAX. `CONTACT_TO_EMAIL` overrides the owner recipient. No Resend key
is required for this route. FormSubmit may require recipient activation by email.
Provider acceptance is not proof of inbox delivery. Notification failure does not
discard the lead or tell the visitor to resubmit. There is no automatic retry queue.
The other project-request and workspace routes retain their existing behavior.

FormSubmit receives the visitor's name, email, startup, website, project, need and
budget. Supabase stores the same information. Retention and legal notices still
need the owner's review. No automatic reply is sent to visitors.
