import { rateLimit } from "express-rate-limit";

export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per 15 minutes
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		error: {
			code: 429,
			message: "Too many authentication requests from this IP, please try again later.",
		},
	},
});

export const certDownloadLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 60,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		error: {
			code: 429,
			message: "Too many download requests, please try again later.",
		},
	},
});
