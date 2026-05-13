/**
 * List of authorized administrator emails.
 * Users in this list have access to the /admin route and special UI controls.
 */
export const ADMIN_EMAILS = [
  'ssumi@example.com',
  'ssumit8709@gmail.com',
  'csumitsharma31@gmail.com'
];

/**
 * Helper to check if an email is an admin.
 */
export function isAdmin(email?: string | null) {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}
