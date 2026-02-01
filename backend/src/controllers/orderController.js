const Order = require('../models/Order');

class OrderController {

	// Créer la commande

	async create(req, res) {
	try {
		const order = await Order.create({
			...req.body,
			created_by: req.user.id
		});

		res.status(201).json({
			success: true,
			data: order,
			message: 'Commande créée'
		});

	} catch (error) {
		console.error('Create error:', error);
		res.status(500).json({ error: 'Erreur création' });
	}
	}

	//Créer commande avec impression
	async createAndPrint(req, res) {
		try {
			const order = await Order.create({
				...req.body,
				created_by: req.user.id
			});

			//Logique d'impression ici
			console.log('Impression commande #${order.id}');

			res.status(201).json({
				success: true,
				data: order,
				message: 'Commande créée et imprimée',
				printed: true
			});

		} catch (error) {
			console.error('Create & print error:', error);
			res.status(500).json({ error: 'Erreur création' });
		}
	}

	//Liste commandes 
	async getAll(req, res) {
		try { 
			const orders = await Order.getAll();
			res.json({ success: true, data: orders });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	//Détails commande
	async getById(req, res) {
		try {
			const { id } = req.params;
			const order = await Order.getById(id);

			if (!order) {
				return res.status(404).json({ error: 'Commande non trouvée' });
			}

			res.json({ success: true, data: order });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	//Changer statut
	async updateStatus(req, res) {
		try {
			const { id } = req.params;
			const { status } = req.body;

			const order = await Order.updateStatus(id, status);
			res.json({ success: true, data: order });

		}catch (error) {
			res.status(500).json({ error: error.message });
		}
	}

	//Marquer comme payé 
	async markAsPaid(req, res) {
		try {
			const { id } = req.params;
			const order = await Order.markAsPaid(id);
			res.json({ success: true, data: order });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

module.exports = new OrderController();

