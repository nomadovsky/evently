import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { EventListItem } from '../components/EventListItem';
import { Event } from '../utils/types';
import { useAuthUser } from 'react-auth-kit';
import { EventObjectProps } from './Home';
import { UserIdContext } from '../context/UserIdContext';
import { Box, Grid, Typography } from '@mui/material';

const MyEvents = () => {
	const [events, setEvents] = useState<Event[]>([]);

	const context = useContext(UserIdContext);

	if (!context) {
		throw new Error('useUserId must be used within a UserIdProvider');
	}

	const userId = context.userId;

	const fetchEvents = async () => {
		try {
			const response = await axios.get<EventObjectProps>(
				`${import.meta.env.VITE_MAIN_ROUTE}/events/`,
				{
					headers: {
						['x-access-token']: `${import.meta.env.VITE_TOKEN_KEY}`,
					},
					withCredentials: false,
				}
			);

			if (!userId) return;

			const userEvents = response.data.events.filter((event) =>
				event.participants.includes(userId)
			);

			console.log(userId);
			console.log(userEvents);

			setEvents(userEvents);
		} catch (error) {
			console.error('Error fetching events:', error);
		}
	};

	useEffect(() => {
		fetchEvents();
	}, [userId]);

	return (
		<>
			<Typography padding={2} variant="h3" color={'Highlight'} p={2}>
				My events
			</Typography>
			<Grid container spacing={2} sx={{ padding: 2 }}>
				{events.length > 0 ? (
					events.map((item) => (
						<Grid
							key={`grid_item-${item._id}`}
							item
							sm={12}
							md={6}
							lg={4}
							xl={3}
							display={'flex'}
							justifyContent={'center'}
						>
							<Box>
								<EventListItem
									_id={item._id}
									name={item.name}
									date={item.startDate}
									description={item.description}
									image={item.image}
									x={item.latitude}
									y={item.longitude}
									participants={item.participants}
									owner={item.owner}
									afterClick={fetchEvents}
								/>
							</Box>
						</Grid>
					))
				) : (
					<Grid
						item
						margin={'auto'}
						height={'50vh'}
						display={'flex'}
						justifyContent={'center'}
						alignItems={'center'}
					>
						<Typography variant="h5">No events found</Typography>
					</Grid>
				)}
			</Grid>
		</>
	);
};

export default MyEvents;
