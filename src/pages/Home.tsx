import {
	Box,
	Grid,
	MenuItem,
	Select,
	TextField,
	Typography,
} from '@mui/material';
import { EventListItem } from '../components/EventListItem';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Event } from '../utils/types';

export interface EventObjectProps {
	events: Event[];
}

const Home = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [eventType, setEventType] = useState('');

	const fetchEvents = async () => {
		try {
			let url = 'http://localhost:9090/events/';

			if (searchQuery || eventType) {
				url += '?';
			}

			if (searchQuery) {
				url += `filter=name&value=${searchQuery}&`;
			}

			if (eventType) {
				url += `filter=type&value=${eventType}&`;
			}

			if (url.endsWith('&')) {
				url = url.slice(0, -1);
			}

			const response = await axios.get<EventObjectProps>(url, {
				headers: {
					['x-access-token']: `${import.meta.env.VITE_TOKEN_KEY}`,
				},
				withCredentials: false,
			});

			setEvents(response.data.events);
		} catch (error) {
			console.error('Error fetching events:', error);
		}
	};

	// const fetchEvents = async () => {
	// 	try {
	// 		let url = 'http://localhost:9090/events';

	// 		if (searchQuery || eventType) {
	// 			url += '?';
	// 		}

	// 		if (searchQuery) {
	// 			url += `filter=name&value=${encodeURIComponent(searchQuery)}&`;
	// 		}

	// 		if (eventType) {
	// 			url += `filter=type&value=${encodeURIComponent(eventType)}&`;
	// 		}

	// 		if (url.endsWith('&')) {
	// 			url = url.slice(0, -1);
	// 		}

	// 		const response = await axios.get<EventObjectProps>(url, {
	// 			headers: {
	// 				['x-access-token']: `${import.meta.env.VITE_TOKEN_KEY}`,
	// 			},
	// 			withCredentials: false,
	// 		});

	// 		setEvents(response.data.events);
	// 	} catch (error) {
	// 		console.error('Error fetching events:', error);
	// 	}
	// };

	useEffect(() => {
		fetchEvents();
	}, [searchQuery, eventType]);

	return (
		<>
			<Grid container>
				<Grid
					sm={12}
					md={9}
					component="form"
					sx={{
						'& .MuiTextField-root': { m: 1, width: '80%' },
					}}
					display={'flex'}
					justifyContent={'center'}
					noValidate
					autoComplete="off"
				>
					<TextField
						id="outlined-search"
						label="Find Event"
						type="search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</Grid>
				<Grid item sm={12} md={3}>
					<Select
						sx={{ m: 1 }}
						value={eventType}
						onChange={(e) => setEventType(e.target.value)}
						label="Filter"
						labelId="event-type-label"
						displayEmpty
					>
						<MenuItem value="">All</MenuItem>
						<MenuItem value={'Sport'}>Sport</MenuItem>
						<MenuItem value={'Concert'}>Music</MenuItem>
						<MenuItem value={'Test'}>Test</MenuItem>
					</Select>
				</Grid>
			</Grid>
			<Grid
				container
				spacing={2}
				sx={{ padding: 2, paddingBottom: 2, paddingRight: 2 }}
			>
				{events.length && searchQuery === '' && !eventType
					? events.map((item) => (
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
									/>
								</Box>
							</Grid>
					  ))
					: events
							.filter((event) =>
								event.name.toLowerCase().includes(searchQuery.toLowerCase())
							)
							.filter(
								(event) =>
									!eventType ||
									eventType === '' ||
									event.type?.toLowerCase() === eventType.toLowerCase()
							)
							.map((item) => (
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
									<Box key={`box-${item._id}`}>
										<EventListItem
											key={`event_list_item-${item._id}`}
											_id={item._id}
											name={item.name}
											date={item.startDate}
											description={item.description}
											image={item.image}
											x={item.latitude}
											y={item.longitude}
											participants={item.participants}
											owner={item.owner}
										/>
									</Box>
								</Grid>
							))}
				{events.filter((event) =>
					event.name.toLowerCase().includes(searchQuery.toLowerCase())
				).length === 0 &&
					searchQuery !== '' && (
						<Grid item margin={'auto'}>
							<Typography variant="h2">Event not found</Typography>
						</Grid>
					)}
				{/* {events.map((item) => (
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
							/>
						</Box>
					</Grid>
				))} */}
			</Grid>
		</>
	);
};

export default Home;
