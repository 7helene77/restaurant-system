const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
	static async findByEmail(email) {
		const result = await db.query(
			'SELECT * FROM users WHERE email = $1',
			[email]
		);
		return result.rows[0];
	}

	static async verifyPassword(password, hash) {
		return await
			bcrypt.compare(password, hash);
	}

	static async findById(id) {
		const result = await db.query(
			'SELECT id, name, email, role FROM users WHERE id = $1', 
			[id]
		);
		return result.rows[0];
	}
}


module.exports = User;

