// Push notifications removed — chat works via real-time Firestore listeners.
// Kept as a stub so existing imports don't break.
export async function requestNotificationPermission(_businessId: string): Promise<boolean> {
  return false;
}
