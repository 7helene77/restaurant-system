import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () =>
	useContext(AuthContext);

export const AuthProvider = ({ children })
=> {
	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem('user');
		return savedUser ?
			JSON.parse(savedUser) : null;
	});

	const login = (userData, token) => {
		setUser(userData);
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(userData));
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	};

	return (
		<AuthContext.Provider value={{
			user,
			login,
			logout,
			isAuthenticated: !!user
		}}>

		{children}
		</AuthContext.Provider>
	);
};

