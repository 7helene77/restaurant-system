const User = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthController {
	async login(req, res) {
		try {
			const { emqil, password } = req.body;

			//Vérifier utilisateur
			const user = await User.findByEmail(email);
			if(!user) {
				return res.status(401).json({ error: 'Identifiants incorrects' });
			}

			//Vérifier mot de passe
			const isValid = await User.verifyPassword(password, user.password_hash);
			if (!isValid) {
				return res.status(401).json({ error: 'Identifiants incorrects' });
			}

			//Générer token
			const token = jwt.sign(
				{ id: user.id, email: user.email, role: user.role, name: user.name },
				process.env.JWT_SECRET || 'restaurant-secret',
				{ expiresIn: '8h' }
			);

			res.json({
				success: true,
				token,
				user: {
					id: user.id,
					name: user.nae,
					email: user.email,
					role: user.role
				}
			});

		} catch (error) {
			console.error('Login error:', error);
			res.status(500).json({ error: "Erreur serveur' });
		}
	}
}

module.exports = new AuthController();

