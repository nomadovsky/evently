import {
	Box,
	Card,
	CardContent,
	CardMedia,
	Grid,
	Paper,
	Typography,
	useTheme,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import getLocationName from '../utils/getLocationName';
import MapLink from '../utils/MapLink';
import { SingleEventMap } from '../components/SingleEventMap';
import { Event, User } from '../utils/types';
import getFormattedDate from '../utils/getFormattedDate';

interface EventPageProps {
	events: Event[];
}
interface UserProps {
	user: User;
}

const EventPage = () => {
	const theme = useTheme();
	const { id } = useParams();

	const [event, setEvent] = useState<Event>();
	const [user, setUser] = useState<User | null>();
	const [eventLocation, setEventLocation] = useState<string>('');
	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await axios.get<EventPageProps>(
					'http://localhost:9090/events',
					{
						headers: {
							['x-access-token']: `${import.meta.env.VITE_TOKEN_KEY}`,
						},
					}
				);
				const events = response.data.events;
				const currentEvent = events.filter((item) => item._id === id);
				setEvent(currentEvent[0]);
				const locationName = await getLocationName(
					currentEvent[0].latitude,
					currentEvent[0].longitude
				);
				setEventLocation(locationName);
			} catch (error) {
				console.error('Error fetching events:', error);
			}
		};

		fetchEvents();
	}, []);

	useEffect(() => {
		if (!event?.owner) return;
		const fetchUser = async () => {
			try {
				const response = await axios.get<UserProps>(
					`http://localhost:9090/users/${event.owner}`
				);
				setUser(response.data.user);
			} catch (error) {
				console.error(error);
			}
		};

		fetchUser();
	}, [event]);

	return event ? (
		<Box sx={{ flexGrow: 1, margin: 'auto' }} width={'80%'}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Paper>
						<Card>
							<CardMedia
								component="img"
								alt={`Image for ${event.name}`}
								height="350"
								image={event.image}
								title={event.name}
								sx={{
									objectFit: 'contain',
									backgroundColor: theme.palette.background.paper,
								}}
							/>
							<CardContent>
								<Typography
									mb={1}
									variant="h4"
									component="div"
									color={'primary'}
								>
									{event.name}
								</Typography>
								{user?.email && (
									<Typography color="textSecondary" component="div">
										<strong>Owner:</strong> {user.username || user.email}
									</Typography>
								)}
								<Typography color="textSecondary" component="div" mb={2}>
									<strong>Type:</strong> {event.type}
								</Typography>
								<Typography variant="body2" component="p" width={'80%'}>
									{event.description}
								</Typography>
							</CardContent>
						</Card>
					</Paper>
				</Grid>
				<Grid item xs={6}>
					<Paper>
						<CardContent>
							<Typography color="textSecondary" gutterBottom>
								Date
							</Typography>
							<Typography variant="h6" component="div">
								{getFormattedDate(new Date(event.startDate))}
							</Typography>
						</CardContent>
					</Paper>
				</Grid>
				<Grid item xs={6}>
					<Paper>
						<CardContent>
							<Typography color="textSecondary" gutterBottom>
								Price
							</Typography>
							<Typography variant="h6" component="div">
								{event.price} PLN
							</Typography>
						</CardContent>
					</Paper>
				</Grid>
				<Grid item xs={12}>
					<Paper>
						<CardContent>
							<Typography color="textSecondary" gutterBottom>
								Location
							</Typography>
							<Typography variant="h6" component="div">
								<MapLink address={eventLocation} />
							</Typography>
							<SingleEventMap event={event} />
						</CardContent>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	) : (
		<h3>Loading...</h3>
	);
};

export default EventPage;
