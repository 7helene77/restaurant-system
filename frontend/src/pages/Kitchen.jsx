import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Kitchen = () => {
	const { user } = useAuth();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadOrders();
		const interval = setInterval(loadOrders, 10000); 
		//Rafraîchir toutes les 10s
		return () =>
			clearInterval(interval);
	}, []);

	const loadOrders = async () => {
		try {
			const response = await api.get('/orders');
			//Filtrer commandes en préparation
			const kitchenOrders = response.data.filter(
				order => order.status === 'pending' || order.status === 'preparing');
			setOrders(kitchenOrders);
		} catch (error) {
			console.error('Erreur:', error);
		} finally {
			setLoading(false);
		}
	};

	const updateStatus = async (orderId, status) => {
		try {
			await api.put('/orders/${orderId}/status', { status });
			loadOrders();
		} catch (error) {
			alert('Erreur mise à jour');
		}
	};

	return (
		<div className="p-6 max-w-7x1 mx-auto">
		<div className="flex justify-between items-center mb-6">
		<h1 className="text-2x1 font-bold">Cuisine</h1>
		<button
		onClick={loadOrders}
		className="bg-blue-600 text-white px-4 py-2 rounded"
		>
		Rafraîchir
		</button>
		</div>

		{loading ? (
			<p>Chargement...</p>
		) : orders.length === 0 ? (
			<p className="text-gray-500 text-center py-8">Aucune commande en cuisine</p>
		) : (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{orders.map(order => (
				<div key={order.id}
				className="bg-white rounded shadow p-4">
				<div className="flex justify-between items-start mb-3">
				<div>
				<h3 className="font-bold">Commande #{order.id}</h3>
				<p className="text-sm text-gray-600">

				{order.table_number ? 'Table $
				{order.table_number}' : 'À emporter'}
					</p>
					</div>
					<span 
					className={'px-2 py-1 rounded text-xs ${

						order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
						order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
							'bg-gray-100 text-gray-800'
					}'}>
					{order.status}
					</span>
					</div>

					<div className="mb-4">
					{order.notes && (
						<p className="text-sm italic mb-2">Note: {order.notes}</p>
					)}
					<p className="text-sm">Total: {order.total} €</p>
					</div>

					<div className="space-y-2 mb-4">
					{/* Normalement ici on aurait les articles */}
					<div className="text-sm">Articles: {order.items?.length || 0}</div>
					</div>

					<div className="flex space-x-2">

					{order.status === 'pending' && (
						<button
						onClick={() => updateStatus(order.id, 'preparing)}

						className="flex-1 bg-blue-600 text-white py-2 rounded text-sm"
						>
						Commencer
						</button>
					)}

					{order.status === 'preparing' && (
						<button

						onClick={() => updateStatus(order.id, 'ready')}

						className="flex-1 bg-green-600 text-white py-2 rounded text-sm"
						>
						Prêt
						</button>
					)}

					<button

					onClick={() => updateStatus(order.id, 'cancelled')}

					className="flex-1 bg-red-600 text-white py-2 rounded text-sm"
					>
					Annuler
					</button>
					</div>
					</div>
			))}
				</div>
		)}
			</div>
	);
		};

		export default Kitchen;

