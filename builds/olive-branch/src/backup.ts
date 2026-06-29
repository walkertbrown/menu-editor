// Best-effort backup of the whole menu state to the ServerMac endpoint.
// Never throws — callers treat a false / null result as "offline, try later".
import { BACKUP_URL, RESTAURANT_ID, BACKUP_ENABLED } from './config';
import type { MenuState } from './store';

const endpoint = () => `${BACKUP_URL}/api/menu/${encodeURIComponent(RESTAURANT_ID)}`;

export async function pushBackup(state: MenuState): Promise<boolean> {
  if (!BACKUP_ENABLED) return false;
  try {
    const res = await fetch(endpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedAt: new Date().toISOString(), state }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function pullBackup(): Promise<MenuState | null> {
  if (!BACKUP_ENABLED) return null;
  try {
    const res = await fetch(endpoint());
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.state ? (data.state as MenuState) : null;
  } catch {
    return null;
  }
}
