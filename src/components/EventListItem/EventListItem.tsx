import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, Button, CardActionArea } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import defaultImage from '../../assets/concert.jpg';
import { useContext, useEffect, useState } from 'react';
import getLocationName from '../../utils/getLocationName';
import getFormattedDate from '../../utils/getFormattedDate';
import MapLink from '../../utils/MapLink';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserIdContext } from '../../context/UserIdContext';
import { useIsAuthenticated } from 'react-auth-kit';

interface EventListItemProps {
	_id: string;
	image: string;
	name: string;
	date: string;
	description: string;
	x: number;
	y: number;
	participants: string[];
	owner: string;
	afterClick?: () => void;
}

const EventListItem = ({
	_id,
	image,
	name,
	date,
	description,
	x,
	y,
	participants,
	owner,
	afterClick,
}: EventListItemProps) => {
	const handleImageError = (
		error: React.SyntheticEvent<HTMLImageElement>
	): void => {
		error.currentTarget.src = defaultImage;
	};
	const isAuthenticated = useIsAuthenticated();

	const [location, setLocation] = useState('');
	console.log(location);
	const navigate = useNavigate();

	const context = useContext(UserIdContext);

	if (!context) {
		throw new Error('useUserId must be used within a UserIdProvider');
	}

	const userId = context.userId;

	const [isParticipant, setIsParticipant] = useState(false);

	const handleClickJoin = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_MAIN_ROUTE}/events/event/${_id}`,
				{
					headers: {
						['x-access-token']: `${import.meta.env.VITE_TOKEN_KEY}`,
					},
				}
			);
			const event = response.data.event;
			let participants = Array.isArray(event.participants)
				? event.participants
				: [];
			if (!participants.includes(userId)) {
				participants = [...participants, userId];
			}

			await axios.patch(`${import.meta.env.VITE_MAIN_ROUTE}/events/${_id}`, {
				...event,
				participants,
			});
			setIsParticipant(true);
			afterClick && afterClick();
		} catch (error) {
			console.error('Error updating event:', error);
		}
	};

	const handleClickLeave = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_MAIN_ROUTE}/event/${_id}`,
				{
					headers: {
						['x-access-token']: `${import.meta.env.VITE_TOKEN_KEY}`,
					},
				}
			);
			const event = response.data.event;
			if (event) {
				let participants = Array.isArray(event.participants)
					? event.participants
					: [owner];
				participants = participants.filter(
					(participant: string) => participant !== userId
				);
				console.log(participants);

				await axios.patch(
					`${import.meta.env.VITE_MAIN_ROUTE}/events/${_id}`,
					{
						...event,
						participants,
					},
					{
						headers: {
							['x-access-token']: `${import.meta.env.VITE_TOKEN_KEY}`,
						},
					}
				);
				setIsParticipant(false);
				afterClick && afterClick();
			} else {
				console.error('Event is undefined');
			}
		} catch (error) {
			console.error('Error updating event:', error);
		}
	};

	useEffect(() => {
		setIsParticipant(participants.includes(userId));
	}, [participants, userId]);

	const setLocationName = async (x: number, y: number) => {
		const location = await getLocationName(x, y);
		setLocation(location);
		return location;
	};

	useEffect(() => {
		setLocationName(x, y);
	}, []);

	const truncate = (input: string) =>
		input.length > 100 ? `${input.substring(0, 100)}...` : input;

	return (
		<>
			<Card
				sx={{ width: 350, height: 450 }}
				onClick={() => navigate(`/event/${_id}`)}
			>
				<CardActionArea sx={{ height: '90%' }}>
					<CardMedia
						component="img"
						height="200"
						image={image}
						onError={handleImageError}
					/>
					<CardContent>
						<Box display="flex" justifyContent="space-between">
							<Typography sx={{ fontSize: 14 }} color="orange">
								{getFormattedDate(new Date(date))}
							</Typography>
						</Box>
						<Typography variant="h5" component="div" pb={1}>
							{name}
						</Typography>
						<Typography
							gutterBottom
							sx={{
								fontSize: 14,
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<LocationOnIcon transform="translate(-5,0)" />
							{<MapLink address={location} />}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{truncate(description)}
						</Typography>
					</CardContent>
				</CardActionArea>
				{isAuthenticated() && (
					<Button
						onClick={(e) => {
							e.stopPropagation();
							isParticipant ? handleClickLeave() : handleClickJoin();
						}}
						size="large"
						color="primary"
						sx={{ width: '100%' }}
					>
						{isParticipant ? 'Leave' : 'Join'}
					</Button>
				)}
			</Card>
		</>
	);
};
export default EventListItem;
