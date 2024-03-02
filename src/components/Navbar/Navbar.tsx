import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Drawer,
	List,
	ListItem,
	ListItemText,
	useMediaQuery,
} from '@mui/material';
import { useAuthUser, useIsAuthenticated, useSignOut } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

import Link from '../Link/Link';
import { useState } from 'react';

const Navbar = () => {
	const navigate = useNavigate();
	const signOut = useSignOut();
	const isAuthenticated = useIsAuthenticated();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const isMobile = useMediaQuery('(max-width:900px)');

	const handleLogout = () => {
		localStorage.removeItem('userId');
		signOut();
	};

	const auth = useAuthUser();

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};

	return (
		<AppBar
			position="sticky"
			sx={{ bgcolor: '#D86755', maxWidth: '100%' }}
			elevation={0}
			style={{
				height: 70,
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<Toolbar sx={{ flexWrap: 'wrap' }}>
				<Typography variant="h5" color="inherit" noWrap sx={{ flexGrow: 1 }}>
					<Link href="/" color="rgba(255,255,255)" variant="inherit">
						E-VENTLY
					</Link>
				</Typography>
				{isMobile ? (
					<IconButton
						edge="start"
						color="inherit"
						aria-label="menu"
						onClick={toggleDrawer}
					>
						<MenuIcon />
					</IconButton>
				) : (
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
				)}
			</Toolbar>
			<Drawer anchor="top" open={drawerOpen} onClose={toggleDrawer}>
				<List>
					<ListItem onClick={() => navigate('/')}>
						<ListItemText primary="E-VENTLY" />
					</ListItem>
					{isAuthenticated() && (
						<>
							<ListItem button onClick={() => navigate('/myEvents')}>
								<ListItemText primary="My Events" />
							</ListItem>
							<ListItem button onClick={() => navigate('/addEvent')}>
								<ListItemText primary="Add Event" />
							</ListItem>
						</>
					)}
					<ListItem button onClick={() => navigate('/')}>
						<ListItemText primary="Events" />
					</ListItem>
					<ListItem button onClick={() => navigate('/map')}>
						<ListItemText primary="Map" />
					</ListItem>
					{isAuthenticated() ? (
						<ListItem button onClick={handleLogout}>
							<ListItemText primary="Logout" />
						</ListItem>
					) : (
						<ListItem button onClick={() => navigate('/login')}>
							<ListItemText primary="Sign In" />
						</ListItem>
					)}
				</List>
			</Drawer>
		</AppBar>
	);
};

export default Navbar;
