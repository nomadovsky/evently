export interface Event {
	_id: string;
	name: string;
	description: string;
	isPromoted?: true;
	startDate: string;
	latitude: number;
	longitude: number;
	owner: string;
	participants: string[];
	price?: number;
	type?: string;
	image: string;
}

export interface User {
	username: string;
	email: string;
	password: string;
	image: string;
	events: string[];
	tickets: string[];
	role: string;
	token: string;
}
