/**
 * Requests browser notification permission (HTML5 Notification API).
 * Call once on business-owner login.
 */
export async function initWebNotifications(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

/**
 * Fires a browser notification. Silently no-ops if permission isn't granted.
 */
export function fireBrowserNotification(title: string, body: string, tag: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, { body, tag, requireInteraction: false });
}
