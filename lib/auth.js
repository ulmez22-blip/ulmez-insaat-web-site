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
