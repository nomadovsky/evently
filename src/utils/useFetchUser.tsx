import { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from './types';

interface UserProps {
	user: User;
}

function useFetchUser(userId?: string) {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		if (!userId) return;
		const fetchUser = async () => {
			try {
				const response = await axios.get<User>(
					`http://localhost:9090/users/${userId}`
				);
				setUser(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchUser();
	}, [userId]);

	return user;
}

export default useFetchUser;
