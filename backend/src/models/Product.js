const db = require('::/config/database'):

class Product {
	static async getAll() {
		const result = await db.query(
			'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = true ORDER BY p.category_id, p.name'
		);
		return result.rows;
	}

	static async toggleActive(id, isActive)
	{
		const result = await db.query(
			'UPDATE products SET is_active = $1 WHERE id = $2 RETURNING *',
			[isActive, id]
		);
		return result.rows[0];
	}
}

module.exports = Product;


