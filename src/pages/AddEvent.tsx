import { useContext } from 'react';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import {
	TextField,
	Button,
	FormControlLabel,
	Container,
	Typography,
	Switch,
	Alert,
	Grid,
} from '@mui/material';
import axios from 'axios';
import { DateTimePicker } from '@mui/x-date-pickers';
import { UserIdContext } from '../context/UserIdContext';
import { useNavigate } from 'react-router-dom';
import 'moment-timezone';

interface FormInput {
	name: string;
	type: string;
	street: string;
	city: string;
	description: string;
	startDate: Date;
	endDate: Date;
	image: string;
	latitude: number;
	longitude: number;
	price: number;
	isPromoted: boolean;
}

const EventForm = () => {
	const context = useContext(UserIdContext);
	const navigate = useNavigate();

	if (!context) {
		throw new Error('useUserId must be used within a UserIdProvider');
	}

	const userId = context.userId;

	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<FormInput>();

	const onSubmit: SubmitHandler<FormInput> = async (data: FormInput) => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_MAIN_ROUTE}/events/create`,
				{
					...data,
					owner: userId,
					participants: [userId],
				}
			);
			console.log(response.data);
			navigate('/');
		} catch (error) {
			console.error('Failed to create event', error);
			setError('name', {
				type: 'manual',
				message: 'Something went wrong',
			});
		}
	};

	return (
		<Container maxWidth="sm" sx={{ p: 2 }}>
			<Typography variant="h4">Create New Event</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Controller
					name="name"
					control={control}
					defaultValue=""
					rules={{ required: 'Event name is required' }}
					render={({ field }) => (
						<TextField
							{...field}
							label="Event Name"
							error={!!errors.name}
							helperText={errors.name?.message}
							fullWidth
							margin="normal"
						/>
					)}
				/>
				<Controller
					name="type"
					control={control}
					defaultValue=""
					rules={{ required: 'Type is required' }}
					render={({ field }) => (
						<TextField
							{...field}
							label="Type"
							error={!!errors.type}
							helperText={errors.type?.message}
							fullWidth
							margin="normal"
						/>
					)}
				/>
				<Controller
					name="street"
					control={control}
					defaultValue=""
					rules={{ required: 'Street is required' }}
					render={({ field }) => (
						<TextField
							{...field}
							label="Street"
							error={!!errors.street}
							helperText={errors.street?.message}
							fullWidth
							margin="normal"
						/>
					)}
				/>
				<Controller
					name="city"
					control={control}
					defaultValue=""
					rules={{ required: 'City is required' }}
					render={({ field }) => (
						<TextField
							{...field}
							label="City"
							error={!!errors.city}
							helperText={errors.city?.message}
							fullWidth
							margin="normal"
						/>
					)}
				/>
				<Controller
					name="description"
					control={control}
					defaultValue=""
					rules={{ required: 'Description is required' }}
					render={({ field }) => (
						<TextField
							{...field}
							label="Description"
							error={!!errors.description}
							helperText={errors.description?.message}
							fullWidth
							margin="normal"
						/>
					)}
				/>
				<Grid container item justifyContent="space-between">
					<Controller
						name="startDate"
						control={control}
						rules={{ required: 'Start date is required' }}
						render={({ field }) => (
							<DateTimePicker {...field} label="Start Date" />
						)}
					/>
					<Controller
						name="endDate"
						control={control}
						rules={{ required: 'End date is required' }}
						render={({ field }) => (
							<DateTimePicker {...field} label="End Date" />
						)}
					/>
				</Grid>

				<Controller
					name="image"
					control={control}
					defaultValue=""
					rules={{ required: 'Image is required' }}
					render={({ field }) => (
						<TextField
							{...field}
							label="Image URL"
							error={!!errors.image}
							helperText={errors.image?.message}
							fullWidth
							margin="normal"
						/>
					)}
				/>

				<Controller
					name="price"
					control={control}
					defaultValue={0}
					rules={{ required: 'Price is required' }}
					render={({ field }) => (
						<TextField
							{...field}
							type="number"
							label="Price"
							error={!!errors.price}
							helperText={errors.price?.message}
							fullWidth
							margin="normal"
						/>
					)}
				/>
				<Controller
					name="latitude"
					control={control}
					defaultValue={0}
					rules={{ required: 'Latitude is required' }}
					render={({ field }) => (
						<TextField
							{...field}
							type="number"
							label="Latitude"
							error={!!errors.latitude}
							helperText={errors.latitude?.message}
							fullWidth
							margin="normal"
						/>
					)}
				/>
				<Controller
					name="longitude"
					control={control}
					defaultValue={0}
					rules={{ required: 'Longitude is required' }}
					render={({ field }) => (
						<TextField
							{...field}
							type="number"
							label="Longitude"
							error={!!errors.longitude}
							helperText={errors.longitude?.message}
							fullWidth
							margin="normal"
						/>
					)}
				/>

				{/* ... other fields like 'image', 'latitude', 'longitude', 'price' */}
				<Controller
					name="isPromoted"
					control={control}
					defaultValue={false}
					render={({ field }) => (
						<FormControlLabel
							sx={{ padding: 1 }}
							control={<Switch {...field} />}
							label="Is Promoted?"
						/>
					)}
				/>
				<Button type="submit" fullWidth variant="contained" color="primary">
					Create Event
				</Button>
				{errors.name && <Alert severity="error">{errors.name.message}</Alert>}
			</form>
		</Container>
	);
};

export default EventForm;
