import rateLimit from "express-rate-limit";

const globalRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10, 
    message: {
        status: 429,
        message: "Too many requests. Please try again later."
    }
});

export default globalRateLimiter
