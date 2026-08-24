export default (req, res, next) => {
	const origin = req.headers.origin;
	if (origin) {
		res.set({
			"Access-Control-Allow-Origin": origin,
			"Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE, PATCH",
			"Access-Control-Allow-Headers":
				"Content-Type, Cache-Control, Pragma, Expires, Authorization, X-Dataset-Total, X-Dataset-Offset, X-Dataset-Limit",
			"Access-Control-Max-Age": 5 * 60,
			"Access-Control-Expose-Headers": "X-Dataset-Total, X-Dataset-Offset, X-Dataset-Limit",
		});
		if (req.method === "OPTIONS") {
			return res.status(204).end();
		}
	}
	next();
};
