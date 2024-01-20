import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'react-auth-kit';

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<BrowserRouter>
				<AuthProvider
					authType={'cookie'}
					authName={'_auth'}
					cookieDomain={window.location.hostname}
					cookieSecure={false}
				>
					<App />
				</AuthProvider>
			</BrowserRouter>
		</ThemeProvider>
	</React.StrictMode>
);
