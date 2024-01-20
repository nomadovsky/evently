import { Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import Home from './pages/Home';
import EventPage from './pages/EventPage';
import Login from './pages/Login';
import Register from './pages/Register';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Navbar } from './components/Navbar';
import Map from './pages/Map';
import { UserIdProvider } from './context/UserIdContext';
import MyEvents from './pages/MyEvents';
import AddEvent from './pages/AddEvent';
import { LocalizationProvider } from '@mui/x-date-pickers';

function App() {
	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<UserIdProvider>
				<Navbar />
				<Box>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/logout" element={<Login />} />
						<Route path="/map" element={<Map />} />
						<Route path="/register" element={<Register />} />
						<Route path="/event/:id" element={<EventPage />} />
						<Route path="/myEvents" element={<MyEvents />} />
						<Route path="/addEvent" element={<AddEvent />} />
					</Routes>
				</Box>
			</UserIdProvider>
		</LocalizationProvider>
	);
}

export default App;
