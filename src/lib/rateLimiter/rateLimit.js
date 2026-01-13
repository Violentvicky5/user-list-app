const rateLimitMap = new Map();

/*
 * key = client identifier (IP or user ID)
 * limit = max requests per window
 * windowMs = time window in ms
 */
export function rateLimit({ key, limit = 10, windowMs = 60000 }) {
  const now = Date.now();
  const record = rateLimitMap.get(key);
//for new record
  if (!record) {
    rateLimitMap.set(key, { count: 1, startTime: now });
    setTimeout(() => rateLimitMap.delete(key), windowMs);
    return true;
  }
//for existing record
  if (now - record.startTime > windowMs) {
    rateLimitMap.set(key, { count: 1, startTime: now });
    setTimeout(() => rateLimitMap.delete(key), windowMs);
    return true;
  }

  record.count += 1;
  rateLimitMap.set(key, record);

  return record.count <= limit;
}
