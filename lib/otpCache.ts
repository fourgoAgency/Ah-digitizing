import 'server-only';

type OtpRecord = {
  code: string;
  expiresAt: number;
  used: boolean;
  createdAt: number;
};

const globalForOtpCache = globalThis as typeof globalThis & {
  quoteOtpCache?: Map<string, OtpRecord>;
};

const otpCache = globalForOtpCache.quoteOtpCache ?? new Map<string, OtpRecord>();
globalForOtpCache.quoteOtpCache = otpCache;

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [email, record] of otpCache.entries()) {
    if (record.expiresAt <= now || record.used) {
      otpCache.delete(email);
    }
  }
}

export function storeQuoteOtp(email: string, code: string, expiresAt: number) {
  cleanupExpiredEntries();
  otpCache.set(email, {
    code,
    expiresAt,
    used: false,
    createdAt: Date.now(),
  });
}

export function verifyQuoteOtp(email: string, code: string) {
  cleanupExpiredEntries();
  const record = otpCache.get(email);
  if (!record) return false;
  if (record.used) return false;
  if (record.expiresAt <= Date.now()) {
    otpCache.delete(email);
    return false;
  }
  if (record.code !== code) return false;

  otpCache.set(email, { ...record, used: true });
  return true;
}
