import { Box } from '@mui/material';
import { Event } from '../../utils/types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface SingleEventMapProps {
	event: Event;
}

const SingleEventMap: React.FC<SingleEventMapProps> = ({ event }) => {
	if (!event) {
		return <div>Loading...</div>;
	}

	return (
		<Box
			display={'flex'}
			justifyContent={'center'}
			style={{ height: '300px', width: '100%' }}
		>
			<MapContainer
				center={[event.latitude, event.longitude]}
				zoom={12}
				style={{ height: '100%', width: '100%' }}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
				/>
				<Marker position={[event.latitude, event.longitude]}>
					<Popup>{event.name}</Popup>
				</Marker>
			</MapContainer>
		</Box>
	);
};

export default SingleEventMap;
