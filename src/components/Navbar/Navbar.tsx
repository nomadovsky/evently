import { AppBar, Toolbar, Typography } from '@mui/material';
import { useAuthUser, useIsAuthenticated, useSignOut } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import Link from '../Link/Link';

const Navbar = () => {
	const navigate = useNavigate();
	const signOut = useSignOut();
	const isAuthenticated = useIsAuthenticated();

	const handleLogout = () => {
		localStorage.removeItem('userId');
		signOut();
	};

	const auth = useAuthUser();

	return (
		<AppBar
			position="sticky"
			sx={{ bgcolor: '#D86755' }}
			elevation={0}
			style={{ height: 70, display: 'flex', justifyContent: 'center' }}
		>
			<Toolbar sx={{ flexWrap: 'wrap' }}>
				<Typography variant="h5" color="inherit" noWrap sx={{ flexGrow: 1 }}>
					<Link href="/" color="rgba(255,255,255)" variant="inherit">
						E-VENTLY
					</Link>
				</Typography>
				<nav>
					{isAuthenticated() && (
						<>
							<Typography
								variant="body1"
								color="inherit"
								component={'span'}
								mx={2}
							>
								{`Hello, ${auth()?.email}`}
							</Typography>
							<Link
								variant="button"
								color="inherit"
								href="/myEvents"
								sx={{ my: 1, mx: 1.5 }}
							>
								my events
							</Link>
						</>
					)}
					<Link
						variant="button"
						color="inherit"
						href="/"
						sx={{ my: 1, mx: 1.5 }}
					>
						events
					</Link>
					{isAuthenticated() && (
						<>
							<Link
								variant="button"
								color="inherit"
								href="/addEvent"
								sx={{ my: 1, mx: 1.5 }}
							>
								add event
							</Link>
						</>
					)}
					<Link
						variant="button"
						color="inherit"
						href="/map"
						sx={{ my: 1, mx: 1.5 }}
					>
						map
					</Link>
					{isAuthenticated() ? (
						<Link
							variant="button"
							color="inherit"
							href="/logout"
							onClick={handleLogout}
							sx={{ my: 1, mx: 1.5 }}
						>
							logout
						</Link>
					) : (
						<Link
							variant="button"
							color="primary"
							href="/login"
							sx={{ my: 1, mx: 1.5 }}
						>
							sign in
						</Link>
					)}
				</nav>
			</Toolbar>
		</AppBar>
	);
};

export default Navbar;
