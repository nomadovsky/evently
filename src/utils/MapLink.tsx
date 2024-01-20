import { Button, Typography } from '@mui/material';

type MapLinkProps = {
	address: string;
};

const MapLink = ({ address }: MapLinkProps) => {
	const googleMapsQuery = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		address
	)}`;

	return (
		<Typography
			component={'a'}
			href={googleMapsQuery}
			target="_blank"
			rel="noopener noreferrer"
		>
			{address}
		</Typography>
	);
};

export default MapLink;
