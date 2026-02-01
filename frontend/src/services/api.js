import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:5000/api',
});

//Ajouter token automatiquement 
api.interceptors.request.use(config => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = 'Bearer ${token}';
	}
	return config;
});

//Gérer erreurs 
api.interceptors.response.use(
	response => response.data,
	error => {
		if (error.response?.status === 401)
		{

			localStorage.removeItem('token');
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

export default api;

