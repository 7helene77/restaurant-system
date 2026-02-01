import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

//Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Kitchen from './pages/Kitchen';

function App() {
	return (
		<AuthProvider>
		<BrowserRouter>
		<Routes>
		<Route path="/login" element={<Login />} />
		<Route path="/" element={
			<PrivateRoute>
			<Dashboard />
			</PrivateRoute>
		} />

		<Route path="/orders" element={
			<PrivateRoute>
			<Orders />
			</PrivateRoute>
		} />

		<Route path="/kitchen" element={
			<PrivateRoute>
			<Kitchen />
			</PrivateRoute>
		} />

		<Route path="*" element={<Navigate to="/" />} />
		</Routes>
		</BrowserRouter>
		</AuthProvider>
	);
}

export default App;

