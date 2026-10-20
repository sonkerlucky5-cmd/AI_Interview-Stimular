const buckets = new Map();

const pruneExpired = (now) => {
  for (const [key, entry] of buckets.entries()) {
    if (entry.resetAt <= now) {
      buckets.delete(key);
    }
  }
};

const rateLimit = ({ windowMs = 15 * 60 * 1000, max = 100, prefix = "global" } = {}) => {
  return (req, res, next) => {
    const now = Date.now();
    if (buckets.size > 5000) {
      pruneExpired(now);
    }

    const key = `${prefix}:${req.ip || "unknown"}`;
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;

    if (current.count > max) {
      const retryAfterSec = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
      res.set("Retry-After", String(retryAfterSec));
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please wait and try again.",
        error: {
          code: "ERR_429",
          message: "Too many requests. Please wait and try again.",
          requestId: req.id || null,
        },
      });
    }

    return next();
  };
};

module.exports = rateLimit;
