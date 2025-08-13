export function errorHandler(err, req, res, next) {
	console.error(err);
	const status = err.status || 500;
	return res.status(status).json({ message: err.message || 'Internal Server Error' });
}