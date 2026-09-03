'use client';

import { useState } from 'react';
import { accountInitials } from '@/lib/account-identity';

export function AccountAvatar({ name, src }: { name: string; src: string | null }) {
  const [failed, setFailed] = useState(false);
  return <span className="account-avatar" aria-hidden="true">
    {src && !failed ? <img src={src} alt="" width={44} height={44} referrerPolicy="no-referrer" onError={() => setFailed(true)} /> : accountInitials(name)}
  </span>;
}
