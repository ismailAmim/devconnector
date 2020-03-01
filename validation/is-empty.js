const isEmpty = val =>
	val === undefined ||
	val === null ||
	(typeof value === 'object' && Object.keys(val).length === 0) ||
	(typeof value === 'string' && val.trim().length === 0);

module.exports = isEmpty;