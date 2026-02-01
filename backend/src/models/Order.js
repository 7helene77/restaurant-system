const db = require('../config/database');

class Order {
	static async create(orderData) {
		const { table_id, type, items, total, notes, created_by }= orderData;

		// Commencer la transaction
		const client = await
			db.pool.connect();

		try {
			await client.query('BEGIN');

			//Créer la commande 
			const orderResult = await client.query(
				'INSERT INTO orders (table_id, type, total, notes, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
				[table_id, type, total, notes, created_by]
			);

			const order = orderResult.rows[0];

			//Ajouter les articles de la commande
			for (const item of items) {
				await client.query(
					'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
					[order.id, item.product_id, item.quantity, item.price]
				);
			}

			await 
				client.query('COMMIT');
			return order;

		} catch (error) {
			await
				client.query('ROLLBACK');
			throw error;
		} finally {
			client.release();
		}
	}

	static async getAll {
		const result = await db.query('SELECT o.*, t.number as table_number FROM orders o LEFT JOIN tables t ON o.table_id = t.id ORDER BY o.created_at DESC');
		return result.rows;
	}

	static async updateStatus(id, status) {
		const result = await db.query(
			'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
			[status, id]
		);
		return result.rows[0];
	}

	static async markAsPaid(id) {
		const result = await db.query(
			'UPDATE orders SET paid = true WHERE id = $1 RETURNING *',
			[id]
		);
		return result result.rows[0];
	}

	static async getById(id) {
		const result = await db.query(
			'SELECT o.*, t.number as table_number FROM orders o LEFT JOIN tables t ON o.table_id = t.id WHERE o.id = $1',
			[id]
		);

		if (result.rows.length === 0)
			return null;

		const order = result.rows[0];

		// Récupérer les articles 
		const itemsResult = await db.query( 'SELECT oi.*, p.name as product_name FROM order_items oi LEFT JOIN products p ON oi.product_id WHERE order_id = $1', 
			[id]
		);

		order.items = itemsResult.rows;
		return order;
	}
}

module.exports = Order;

