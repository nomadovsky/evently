import {
	Avatar,
	Button,
	CssBaseline,
	TextField,
	Grid,
	Box,
	Typography,
	Container,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Link from '../components/Link/Link';
import * as Yup from 'yup';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useSignIn } from 'react-auth-kit';

const schema = Yup.object().shape({
	username: Yup.string().required('Username is required'),
	email: Yup.string().email('Invalid email').required('Email is required'),
	password: Yup.string()
		.min(8, 'Password is too short - should be 8 chars minimum')
		.required('Password is required'),
});

export const Register = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const signIn = useSignIn();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			await schema.validate(
				{ username, email, password },
				{ abortEarly: false }
			);
			setErrorMessage('');
			const response = await axios.post('http://localhost:9090/api/register', {
				username,
				email,
				password,
				role: 'user',
			});
			if (response.data && response.data.token) {
				signIn({
					token: response.data.token,
					expiresIn: 3600,
					tokenType: 'Bearer',
					authState: response.data.user,
				});
			} else {
				setErrorMessage('Registration failed');
			}
		} catch (err) {
			if (err instanceof Yup.ValidationError) {
				setErrorMessage(err.errors.join('\n'));
			} else if (err instanceof AxiosError) {
				console.error(err);
				setErrorMessage(err.response?.data);
			}
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="username"
								label="User Name"
								name="username"
								autoComplete="none"
								value={username}
								onChange={(event) => setUsername(event.target.value)}
								error={errorMessage.includes('Username')}
								helperText={
									errorMessage.includes('Username') && 'Username is required'
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								error={errorMessage.includes('Email')}
								helperText={
									errorMessage.includes('Email') &&
									'Invalid email or Email is required'
								}
							/>
						</Grid>
						<Grid item xs={12} mb={2}>
							<TextField
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="new-password"
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								error={errorMessage.includes('Password')}
								helperText={
									errorMessage.includes('Password') &&
									'Password is too short or Password is required'
								}
							/>
						</Grid>
					</Grid>
					<Typography variant="caption" color="red">
						{errorMessage}
					</Typography>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Sign Up
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Link href="/login" variant="body2">
								Already have an account? Sign in
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
};

export default Register;
