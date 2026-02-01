import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState ('');
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		try {
			const response = await api.post('/auth/login', { email, password });
			login(response.user, response.token);
			navigate('/');
		} catch (err) {
			setError('Email ou mot de passe incorrect');
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
		<div className="bg-white p-8 rounded shadow-md w-96">
		<h1 className="text-2x1 font-bold mb-6 text-center">Restaurant</h1>

		{error && (
			<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			{error}
			</div>
		)}

		<form onSubmit={handleSubmit}>
		<div className="mb-4">
		<label className="block text-gray-700 mb-2">Email</label>
		<input 
		type="email"
		value={email}
		onChange={(e) => setEmail(e.target.value)}
		className="w-full p-2 border rounded"

		placeholder="admin@restaurant.com"
		required
		/>
		</div>

		<div className="mb-6">
		<label className="block text-gray-700 mb-2">Mot de passe</label>
		<input
		type="password"
		value={password}
		onChange={(e) => setPassword(e.target.value)}
		className="w-full p-2 border rounded'

		placeholder="********"
		required
		/>
		</div>

		<button 
		type="submit"
		className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
		>
		Se connecter 
		</button>
	</form>

	<div className="mt-6 text-sm text-gray-600">
	<p className="font-medium mb-1">Comptes de test :</p>

	<p>admin@restaurant.com / admin123</p>

	<p>server@restaurant.com / server123</p>
		</div>
	</div>
</div>
);
};

export default Login;
