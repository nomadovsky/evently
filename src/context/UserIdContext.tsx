import {
	createContext,
	useState,
	ReactNode,
	Dispatch,
	SetStateAction,
	useEffect,
} from 'react';

type UserIdContextType = {
	userId: string;
	setUserId: Dispatch<SetStateAction<string>>;
};

export const UserIdContext = createContext<UserIdContextType | undefined>(
	undefined
);

export const UserIdProvider = ({ children }: { children: ReactNode }) => {
	const [userId, setUserId] = useState('');

	useEffect(() => {
		const storedUserId = localStorage.getItem('userId');
		if (storedUserId) {
			setUserId(storedUserId);
		}
	}, []);

	return (
		<UserIdContext.Provider value={{ userId, setUserId }}>
			{children}
		</UserIdContext.Provider>
	);
};
