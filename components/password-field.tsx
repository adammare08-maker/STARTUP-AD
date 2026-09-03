'use client';

import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PasswordField({ mode }: { mode: 'login' | 'signup' }) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  return <div className="password-field">
    <label htmlFor={id}>Mot de passe</label>
    <div className="password-control">
      <input id={id} name="password" type={visible ? 'text' : 'password'}
        minLength={mode === 'signup' ? 10 : 1} maxLength={128}
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        autoCapitalize="none" spellCheck={false} required />
      <Button type="button" variant="ghost" className="password-toggle"
        aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        aria-controls={id} aria-pressed={visible} onClick={() => setVisible(value => !value)}>
        {visible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
      </Button>
    </div>
  </div>;
}
