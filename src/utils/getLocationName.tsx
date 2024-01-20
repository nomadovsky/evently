import axios from 'axios';

const getLocationName = async (
	latitude: number,
	longitude: number
): Promise<string> => {
	try {
		const response = await axios.get(
			`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
		);
		console.log(response.data);
		const address = response.data.address.country
			? `${response.data.address.city}, ${response.data.address.country}`
			: 'unknown location';
		return address;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export default getLocationName;
