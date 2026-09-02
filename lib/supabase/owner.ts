type VerifiedUser = { id: string; email?: string; email_confirmed_at?: string; is_anonymous?: boolean };

// Called only with a user authenticated by Supabase getUser, never form data.
export function isConfiguredOwner(user: VerifiedUser, email?: string, id?: string) {
  return !!email && !!id && user.id === id && !!user.email_confirmed_at &&
    user.is_anonymous !== true && user.email?.toLowerCase() === email.trim().toLowerCase();
}

export function canClaimOwner(userId: string, admins: { id: string }[]) {
  return admins.every(admin => admin.id === userId);
}
