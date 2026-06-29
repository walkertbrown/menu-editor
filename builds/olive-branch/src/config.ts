// Per-deployment config, injected by the hosting HTML via `window.OB_CONFIG`.
// In dev (no OB_CONFIG) backup is simply disabled and the app runs standalone.
// The packaged single-file build sets this to point at the ServerMac backup.
type OBConfig = { backupUrl?: string; restaurantId?: string; restaurantName?: string };

const cfg: OBConfig =
  (typeof window !== 'undefined' && (window as unknown as { OB_CONFIG?: OBConfig }).OB_CONFIG) || {};

export const BACKUP_URL = (cfg.backupUrl || '').replace(/\/+$/, '');
export const RESTAURANT_ID = cfg.restaurantId || '';
export const RESTAURANT_NAME = cfg.restaurantName || 'Olive Branch Café';
export const BACKUP_ENABLED = Boolean(BACKUP_URL && RESTAURANT_ID);
