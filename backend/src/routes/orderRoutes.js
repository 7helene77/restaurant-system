const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, checkRole } = require('../middleware/auth');

//Toutes les routes protégées
router.use(authenticate);

//Voir les commandes 
router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);

//Créer commandes (serveurs et admin)
router.post('/', checkRole(['server', 'admin']), orderController.create);
router.post('/print', checkRole(['server', 'admin']), orderController.createAndPrint);

//Modifier commandes 
router.put('/:id/status', checkRole(['server', 'kitchen', 'admin']), orderController.updateStatus);
router.put('/:id/pay', checkRole(['server', 'admin']), orderController.markAsPaid);

module.exports = router;

