import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Orders = () => {
	const { user } = useAuth();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState({
		table_id: '',
		type: 'on_site',
		items: [],
		total: 0,
		notes: ''
	});

	useEffect(() => {
		loadOrders();
	}, []);

	const loadOrders = async () => {
		try {
			const response = await api.get('/orders');
			setOrders(response.data);
		} catch (error) {
			console.error('Erreur:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (shouldPrint = false) => {
		if (form.items.length === 0) {
			alert('Ajoutez des articles');
			return;
		}

		try {
			const endpoint = shouldPrint ?
				'/orders/print' : '/orders';
			await api.post(endpoint, form);
			alert(shouldPrint ? 'Commande créée et imprimée' : 'Commande créée');
			setForm({ table_id: '', type: 'on_site', items: [], total: 0, notes: '' });
			loadOrders();
		} catch (error) {
			alert('Erreur: ' + (error.error || 'Création impossible'));
		}
	};

	const addItem = (product) => {
		const existing = 
			form.items.find(item => item.product_id === product.id);

		if (existing) {
			setForm(prev => ({
				...prev,
				items: prev.items.map(item =>
					item.product_id === product.id
					? { ...item, 
						quantity: item.quantity + 1 }
					: item
				),
				total: prev.total + product.price
			}));
		} else {
			setForm(prev => ({
				...prev,
				items: [...prev.items, {
					product_id: product.id,
					quantity: 1,
					price: product.price,
					name: product.name
				}],
				total: prev.total + product.price
			}));
		}
	};

	const removeItem = (productId) => {
		const item = form.items.find(item => item.product_id === productId);
		setForm(prev => ({
			...prev,
			items: prev.items.filter(item => item.product_id !== productId),
			total: prev.total - (item.price * item.quantity)
		}));
	};

	//Produits factices pour l'exemple
	const products = [
		{ id: 1, name: 'Salade César', price: 9.50, category: 'Entrée' },
		{ id: 2, name: 'Steak Frites', price: 18.50, category: 'Plats' },
		{ id: 3, name: 'Café', price: 2.50, category: 'Boissons' },
		{ id: 4, name: 'Tiramisu', price: 7.50, category: 'Desserts' }
	];

	return (
		<div className="p-6 max-w-7x1 mx-auto">
		<h1 className="text-2x1 font-bold mb-6">Commandes</h1>

		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
		{/* Formulaire */}
		<div className="bg-white p-6 rounded shadow"> 
		<h2 className="text-x1 font-bold mb-4">Nouvelle Commande</h2>

		<div className="space-y-4">
		<div>
		<label className="block mb-1">Type</label>
		<select value={form.type}

		onChange={(e) => setForm({...form, type: e.target.value})}

		className="w-full p-2 border rounded"
		>
		<option value="on_site">Sur place</option> 
		<option value="takeaway">À emporter</option>
		</select>
		</div>

		{form.type === 'on_site' && (
			<div>
			<label className="block mb-1">Table</label>
			<select value={form.table_id}

			onChange={(e) => setForm({...form, table_id: e.target.value})}

			className="w-full p-2 border rounded"
			>
			<option value="">Sélectionner</option>

			{[1,2,3,4,5,6,7,8,9,10].map(num => (
				<option key={num} value={num}>Table {num}</option>
			))}
			</select>
			</div>
		)}

		<div>
		<label className="block mb-1">Produits</label>
		<div className="grid grid-cols-2 gap-2 mb-4">

		{products.map(product => (
			<button key={product.id}

			type="button"

			onClick={() => addItem(product)}

			className="p-2 border rounded text-left hover:bg-gray-50"
			>
			<div className="font-medium">{product.name}</div>
			<div className="text-sm text-gray-600">{product.price} €</div>
			</button>
		))}
		</div>
		</div>

		{form.items.length >
			0 && (
				<div className="border-t pt-4"> 
				<h3 className="font-bold mb-2">Panier</h3>

				{form.items.map(item => (
					<div key={item.product_id} className="flex justify-between items-center mb-2">

					<span>{item.name} x{item.quantity}</span>

					<div>

					<span className="mr-4">{(item.price * item.quantity).toFixed(2)} €</span>

					<button onClick={() => removeItem(item.product_id)}
					className="text-red-600"
					>

					x

					</button>
					</div>
					</div>
				))}
				<div className="font-bold border-t pt-2 mt-2">
				Total:{form.total.toFixed(2)} €
				</div>
				</div>
			)}

		<div className="flex space-x-3">
		<button onClick={() => handleSubmit(false)}

		className="bg-blue-600 text-white px-4 py-2 rounded flex-1 hover:bg-blue-700"
		>
		Créer Commande 
		</button>

		<button onClick={() => handleSubmit(true)}

		className="bg-green-600 text-white px-4 py-2 rounded flex-1 hover:bg-green-700"
		>
		Créer + Imprimer
		</button>
		</div>
		</div>
		</div>

		{/* Liste commandes */}
		<div className="bg-white p-6 rounded shadow">
		<h2 className="text-x1 font-bold mb-4">Commandes Récentes</h2>

		{loading ? (
			<p>Chargement...</p>
] : orders.length ===
	0 ? (
		<p className="text-gray-500">Aucune commande</p>
	) : (
		<div className="space-y-3">

		{orders.map(order => (
			<div key={order.id} className="border p-3 rounded">
			<div className="flex justify-between mb-2">

			<span className="font-bold">#{order.id}</span>

			<span className={'px-2 py-1 rounded text-xs ${

				order.status === 'pending' ? 'bg-yellow-100':

				order.status === 'preparing' ? 'bg-blue-100':

				order.status === 'ready' ? 'bg-green-100': 'bg-gray-100'
			}'}>
			{order.status}
			</span>
			</div>
			<div className="text-sm text-gray-600">

			{order.table_number ? 'Table $
			{order.table_number}' : 'À emporter'}
			{order.total} €
				</div>
				</div>
		))}
		</div>
	)}
		</div>
		</div>
		</div>
		);
};

export default Orders;

