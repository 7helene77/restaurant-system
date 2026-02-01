const express = required('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

//Route de test
app.get('/api/test', (req, res) => {
	res.json({ status: 'OK', message: 'API fonctionne' });
});

//Gestion des erreurs 
app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ error: 'Erreur serveur' });
});

//Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log('Serveur sur http://localhost:${PORT}');
});


