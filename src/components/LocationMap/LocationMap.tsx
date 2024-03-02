import { memo, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { Box } from '@mui/material';
import axios from 'axios';
import { EventObjectProps } from '../../pages/Home';
import { Event } from '../../utils/types';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

const LocationMap: React.FC = () => {
	const [events, setEvents] = useState<Event[]>([]);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await axios.get<EventObjectProps>(
					`${import.meta.env.VITE_MAIN_ROUTE}/events`,
					{
						headers: {
							['x-access-token']: `${import.meta.env.VITE_TOKEN_KEY}`,
						},
						withCredentials: false,
					}
				);
				setEvents(response.data.events);
			} catch (error) {
				console.error('Error fetching events:', error);
			}
		};

		fetchEvents();
	}, []);

	const navigate = useNavigate();

	return (
		<Box
			display={'flex'}
			justifyContent={'center'}
			style={{ height: '100%', width: '100%' }}
		>
			<MapContainer
				center={[51.9194, 19.1451]}
				zoom={7}
				scrollWheelZoom={false}
				style={{ height: '100%', width: '100%' }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>{' '}
				{events.map((event) => (
					<Marker
						key={event._id}
						position={[event.latitude, event.longitude]}
						eventHandlers={{
							click: () => {
								navigate(`/event/${event._id}`);
							},
						}}
					>
						<Tooltip>{event.name}</Tooltip>
					</Marker>
				))}
			</MapContainer>
		</Box>
	);
};

export default memo(LocationMap);
