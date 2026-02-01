const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
	const token = req.header('Authorization')?.replace('Bearer', '');

	if (!token) {
		return res.status(401).json({ error: 'Accès non autorisé'});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'restaurant-secret');
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ error: 'Token invalide' });
	}
};

const checkRole = (roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role))
		{
			return res.status(403).json({ error: 'Permission refusée' });
		}
		next();
	};
};

module.exports = { authenticate, checkRole };

