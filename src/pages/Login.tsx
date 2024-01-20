import {
	Avatar,
	Box,
	Button,
	Container,
	CssBaseline,
	Grid,
	TextField,
	Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Link from '../components/Link/Link';
import * as Yup from 'yup';
import axios from 'axios';
import { useSignIn } from 'react-auth-kit';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIdContext } from '../context/UserIdContext';

let schema = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Email is required'),
	password: Yup.string()
		.min(8, 'Password is too short - should be 8 chars minimum')
		.required('This field is required'),
});

const Login = () => {
	const signin = useSignIn();

	const context = useContext(UserIdContext);
	if (!context) {
		throw new Error('useUserId must be used within a UserIdProvider');
	}
	const { setUserId } = context;

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			await schema.validate({ email, password }, { abortEarly: false });
		} catch (err) {
			if (err instanceof Yup.ValidationError) {
				setErrorMessage(err.errors.join('\n'));
			} else {
				console.error(err);
				setErrorMessage('An unexpected error occurred');
			}
			return;
		}

		try {
			setErrorMessage('');
			const response = await axios.post('http://localhost:9090/login', {
				email,
				password,
			});
			if (response.status === 200) {
				signin({
					token: response.data.token,
					expiresIn: 3600,
					authState: { email: email },
					tokenType: 'Bearer',
				});
				localStorage.setItem('userId', response.data._id);

				navigate('/');
			}
		} catch (err) {
			console.error(err);
			setErrorMessage('Invalid Credentials');
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
					Sign in
				</Typography>
				<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
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
								error={
									errorMessage.includes('Email') ||
									errorMessage.includes('email')
								}
								helperText={
									(errorMessage.includes('Email') && 'Email is required') ||
									(errorMessage.includes('email') && 'Invalid email')
								}
							/>
						</Grid>
						<Grid item xs={12}>
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
									errorMessage.includes('Password') && 'Invalid password'
								}
							/>
						</Grid>
						{errorMessage.includes('Credentials') && (
							<Typography variant="body2" color="error">
								Invalid Credentials, please try again
							</Typography>
						)}
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Sign In
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Link href="/register" variant="body2">
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
};

export default Login;
