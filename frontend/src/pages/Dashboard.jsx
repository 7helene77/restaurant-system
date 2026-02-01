import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Dashboard = () => {
	const { user, logout } = useAuth();
	const [recentOrders, setRecentOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadOrders();
	}, []);

	const loadOrders = async () => {
		try {
			const response = await api.get('/orders');

			setRecentOrders(response.data.slice(0,5)); // 5 dernières commandes 
		} catch (error) {
			console.error('Erreur:', error);
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status) => {
		switch(status) {
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'preparing': return 'bg-blue-100 text-blue-800';
			case 'ready': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
		{/* Navigation */}
		<nav className="bg-white shadow">
			<div className="max-w-7x1 mx-auto px-4 py-3">
				<div className="flex justify-between items-center">
					<h1 className="text-x1 font-bold">Tableau de Bord</h1>
					<div className="flex items-center space-x-4">
						<span className="text-gray-700">Bonjour, {user?.name}</span>
						<button onClick={logout}

		className="bg-red-600 text-white px-3 py-1 rounded text-sm"
		>
		Déconnexion
		</button>
	</div>
</div>
</div>
</nav>

		{/* Contenu */}
		<main className="max-w-7x1 mx-auto px-4 py-8">
			<div className="mb-8">
				<h2 className="text-2x1 font-bold mb-4">Commandes Récentes</h2>

		{loading ? (
			<p>Chargement...</p>
		) : recentOrders.length === 0 ? (
			<p className="text-gray-500">Aucune commande</p>
		) : (
			<div className="bg-white rounded shadow overflow-hidden">
				<table className="min-w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-4 py-3 text-left">N°</th>
							<th className="px-4 py-3 text-left">Table</th>
							<th className="px-4 py-3 text-left">Total</th>
							<th className="px-4 py-3 text-left">Statut</th>
			</th>
			</thead>
			<tbody>
			{recentOrders.map(order => (
				<tr key={order.id} className="border-t">
				<td className="px-4 py-3">#{order.id}</td>

				<td className="px-4 py-3">

				{order.table_number || 'À emporter'}

				</td>

				<td className="px-4 py-3">{order.total} €</td>

				<td className="px-4 py-3">

				<span className={'px-2 py-1 rounded text-xs
					${getStatusColor(order.status)}'}>

				{order.status}

				</span>

				</td>

				</tr>
			))}
			</tbody>
			</table>
			</div>
		)}
		</div>

		{/* Actions rapides */}
		<div>
		<h3 className="text-lg font-bold mb-4">Actions</h3>
		<div className="flex space-x-4">
		{user?.role === 'server' || user?.role === 'admin' ? (
			<a 
			href="/orders"

			className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
			>
			Nouvelle commande
			</a>
		) : null}

		{user?.role === 'kitchen' ? (
			<a 
			href="/kitchen"

			className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
			>
			Voir cuisine
			</a>
		) : null}
		</div>
		</div>
		</main>
		</div>
	);
};

export default Dashboard;

