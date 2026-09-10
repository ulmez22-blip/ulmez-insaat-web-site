import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const SECRET = process.env.ADMIN_SESSION_SECRET || 'ulmez-dev-secret-change-me';
const ENV_PASSWORD = process.env.ADMIN_PASSWORD || 'ulmez1980';
const AUTH_FILE = path.join(process.cwd(), 'data', 'auth.json');

export const SESSION_COOKIE = 'ulmez_admin_session';

function readStoredHash() {
  try {
    const data = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
    return data.passwordHash || null;
  } catch {
    return null;
  }
}

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function checkPassword(password) {
  const stored = readStoredHash();
  if (stored) {
    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;
    const candidate = hashPassword(String(password || ''), salt);
    try {
      return crypto.timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(hash, 'hex'));
    } catch {
      return false;
    }
  }
  // No password has been set from the admin panel yet — fall back to the
  // default in .env.local (or the built-in default) so first login works.
  return password === ENV_PASSWORD;
}

export function setPassword(newPassword) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(newPassword, salt);
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ passwordHash: `${salt}:${hash}` }, null, 2));
}

// In-memory brute-force protection for /admin login. Resets if the process
// restarts, which is fine — the point is to slow down automated guessing,
// not to be a permanent ledger.
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const loginAttempts = new Map(); // ip -> { count, lockedUntil }

export function isLoginLocked(ip) {
  const entry = loginAttempts.get(ip);
  if (!entry) return false;
  if (entry.lockedUntil && entry.lockedUntil > Date.now()) return true;
  if (entry.lockedUntil && entry.lockedUntil <= Date.now()) {
    loginAttempts.delete(ip);
    return false;
  }
  return false;
}

export function recordFailedLogin(ip) {
  const entry = loginAttempts.get(ip) || { count: 0, lockedUntil: null };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
  }
  loginAttempts.set(ip, entry);
}

export function clearLoginAttempts(ip) {
  loginAttempts.delete(ip);
}

export function makeSessionToken() {
  return crypto.createHmac('sha256', SECRET).update('admin-session').digest('hex');
}

export function isValidSessionToken(token) {
  if (!token) return false;
  const expected = makeSessionToken();
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}
