/**
 * Username system — validation, freemium gating, suggestion engine
 * All rules are enforced here AND on the server action for defense-in-depth.
 */

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

/** Usernames blocked for everyone regardless of plan */
export const RESERVED_USERNAMES = new Set([

  // ── App routes (match Next.js pages) ──────────────────────────
  'admin', 'api', 'auth', 'callback', 'onboarding',
  'login', 'logout', 'signin', 'signout', 'signup', 'register',
  'dashboard', 'settings', 'profile', 'account', 'billing',
  'privacy', 'terms', 'status', 'docs', 'documentation',
  'product', 'products', 'showcase', 'pricing', 'plans',
  'contact', 'about', 'team', 'careers', 'jobs', 'press',
  'blog', 'news', 'changelog', 'releases', 'roadmap',
  'help', 'faq', 'support', 'feedback',

  // ── Infrastructure / system ────────────────────────────────────
  'www', 'mail', 'email', 'smtp', 'ftp', 'cdn', 'static',
  'assets', 'media', 'uploads', 'files', 'storage',
  'app', 'apps', 'web', 'mobile', 'desktop', 'embed',
  'root', 'system', 'server', 'host', 'hosting',
  'database', 'db', 'sql', 'redis', 'cache',
  'dev', 'development', 'staging', 'production', 'test', 'testing',
  'internal', 'external', 'local', 'localhost',
  'null', 'undefined', 'none', 'void', 'error', 'errors',
  'true', 'false',

  // ── Security / impersonation targets ──────────────────────────
  'superadmin', 'moderator', 'mod', 'staff', 'official',
  'founder', 'ceo', 'cto', 'coo', 'owner', 'operator',
  'verified', 'verification', 'security', 'secure',
  'trust', 'safety', 'compliance', 'legal', 'policy',

  // ── Business / brand ──────────────────────────────────────────
  'biolinks', 'biolink', 'bio', 'linkinbio', 'linktree',
  'zingqr', 'zing',
  'shop', 'store', 'market', 'marketplace', 'ecommerce',
  'pay', 'payments', 'checkout', 'invoice', 'subscription',
  'analytics', 'insights', 'metrics', 'stats', 'statistics',
  'explore', 'discover', 'search', 'browse',
  'home', 'index', 'landing', 'start', 'begin',
  'new', 'create', 'add', 'edit', 'delete', 'remove',
  'invite', 'invites', 'referral', 'referrals',
  'upgrade', 'downgrade', 'cancel', 'cancellation',

  // ── Common platform / social names ────────────────────────────
  'google', 'apple', 'microsoft', 'amazon', 'meta',
  'facebook', 'instagram', 'twitter', 'x', 'tiktok', 'snapchat',
  'youtube', 'linkedin', 'pinterest', 'reddit', 'discord',
  'twitch', 'telegram', 'whatsapp', 'signal',
  'github', 'gitlab', 'bitbucket', 'vercel', 'netlify',
  'spotify', 'soundcloud', 'apple.music',
  'paypal', 'stripe', 'visa', 'mastercard',

  // ── Common reserved words ──────────────────────────────────────
  'me', 'you', 'we', 'us', 'they', 'he', 'she', 'it',
  'user', 'users', 'member', 'members', 'guest',
  'everyone', 'all', 'public', 'private', 'anonymous',
  'nobody', 'somebody', 'anybody',
  'info', 'information', 'data', 'report', 'reports',
  'network', 'connection', 'connect',
  'notification', 'notifications', 'alerts', 'messages',
  'chat', 'inbox', 'outbox', 'drafts',

]);


/** Regex: lowercase letters, numbers, dot, underscore. 3–30 chars */
export const USERNAME_REGEX = /^[a-z0-9._]{3,30}$/;

// ─────────────────────────────────────────────
// PREMIUM DETECTION
// ─────────────────────────────────────────────

/**
 * Returns true if the username is "premium-style":
 * - Less than 8 characters AND
 * - Contains only letters (no numbers, dots, underscores)
 *
 * Examples: sumit, alex, dev → premium
 * Examples: sumit99, hey.sumit, dev_2026 → free-allowed
 */
export function isPremiumUsername(username: string): boolean {
  const clean = username.toLowerCase().trim();
  if (clean.length >= 8) return false;
  // If it contains digits, dots, or underscores → not premium-only
  if (/[0-9._]/.test(clean)) return false;
  return true;
}

// ─────────────────────────────────────────────
// FORMAT VALIDATION
// ─────────────────────────────────────────────

export type UsernameFormatError =
  | 'TOO_SHORT'
  | 'TOO_LONG'
  | 'INVALID_CHARS'
  | 'CONSECUTIVE_DOTS'
  | 'CONSECUTIVE_UNDERSCORES'
  | 'STARTS_WITH_DOT_OR_UNDERSCORE'
  | 'ENDS_WITH_DOT_OR_UNDERSCORE'
  | null;

const FORMAT_MESSAGES: Record<NonNullable<UsernameFormatError>, string> = {
  TOO_SHORT: 'Username must be at least 3 characters',
  TOO_LONG: 'Username must be 30 characters or fewer',
  INVALID_CHARS: 'Only lowercase letters, numbers, dots, and underscores are allowed',
  CONSECUTIVE_DOTS: 'Dots cannot appear consecutively (..)',
  CONSECUTIVE_UNDERSCORES: 'Underscores cannot appear consecutively (__)',
  STARTS_WITH_DOT_OR_UNDERSCORE: 'Username cannot start with a dot or underscore',
  ENDS_WITH_DOT_OR_UNDERSCORE: 'Username cannot end with a dot or underscore',
};

export function validateUsernameFormat(username: string): { valid: boolean; error: string | null } {
  const u = username.toLowerCase().trim();

  if (u.length < 3) return { valid: false, error: FORMAT_MESSAGES.TOO_SHORT };
  if (u.length > 30) return { valid: false, error: FORMAT_MESSAGES.TOO_LONG };
  if (!USERNAME_REGEX.test(u)) return { valid: false, error: FORMAT_MESSAGES.INVALID_CHARS };
  if (/\.\./.test(u)) return { valid: false, error: FORMAT_MESSAGES.CONSECUTIVE_DOTS };
  if (/__/.test(u)) return { valid: false, error: FORMAT_MESSAGES.CONSECUTIVE_UNDERSCORES };
  if (/^[._]/.test(u)) return { valid: false, error: FORMAT_MESSAGES.STARTS_WITH_DOT_OR_UNDERSCORE };
  if (/[._]$/.test(u)) return { valid: false, error: FORMAT_MESSAGES.ENDS_WITH_DOT_OR_UNDERSCORE };

  return { valid: true, error: null };
}

// ─────────────────────────────────────────────
// FULL PIPELINE VALIDATION
// ─────────────────────────────────────────────

export type ValidationResult =
  | { ok: true }
  | { ok: false; reason: 'FORMAT'; message: string }
  | { ok: false; reason: 'RESERVED'; message: string }
  | { ok: false; reason: 'PREMIUM_REQUIRED'; message: string };

export function validateUsername(
  username: string,
  planType: 'free' | 'premium' = 'free'
): ValidationResult {
  const normalized = username.toLowerCase().trim();

  // 1. Format check
  const format = validateUsernameFormat(normalized);
  if (!format.valid) {
    return { ok: false, reason: 'FORMAT', message: format.error! };
  }

  // 2. Reserved check
  if (RESERVED_USERNAMES.has(normalized)) {
    return { ok: false, reason: 'RESERVED', message: 'This username is reserved and cannot be used' };
  }

  // 3. Plan check
  if (planType === 'free' && isPremiumUsername(normalized)) {
    return {
      ok: false,
      reason: 'PREMIUM_REQUIRED',
      message: 'Short single-word usernames are reserved for Pro members',
    };
  }

  return { ok: true };
}

// ─────────────────────────────────────────────
// SUGGESTION ENGINE
// ─────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();

const PREFIXES = ['hey', 'its', 'im', 'the', 'real'];
const SUFFIXES = [
  `${CURRENT_YEAR}`,
  `${CURRENT_YEAR % 100}`, // e.g. "26"
  '99', '07', '01',
  'dev', 'hq', 'official',
];

function cleanBase(raw: string): string {
  // Strip everything except letters
  return raw.toLowerCase().replace(/[^a-z]/g, '').slice(0, 18);
}

/**
 * Generate up to 7 human-friendly username suggestions based on a base string.
 * All suggestions pass free-plan validation.
 */
export function generateSuggestions(base: string): string[] {
  const b = cleanBase(base);
  if (!b) return [];

  const candidates: string[] = [
    `${b}99`,
    `hey.${b}`,
    `${b}_${CURRENT_YEAR}`,
    `${b}dev`,
    `its${b}`,
    `${b}.hq`,
    `${b}01`,
    `the.${b}`,
    `${b}_official`,
    `im${b}`,
  ];

  // Deduplicate and filter only valid free-plan usernames
  const seen = new Set<string>();
  const valid: string[] = [];
  for (const c of candidates) {
    if (seen.has(c)) continue;
    seen.add(c);
    const result = validateUsername(c, 'free');
    if (result.ok) valid.push(c);
    if (valid.length >= 5) break;
  }

  return valid;
}

// ─────────────────────────────────────────────
// NORMALIZE
// ─────────────────────────────────────────────

/** Always normalize before saving to DB */
export function normalizeUsername(username: string): string {
  return username.toLowerCase().trim();
}
