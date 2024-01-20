import { Grid } from '@mui/material';
import { LocationMap } from '../components/LocationMap';

const Map = () => {
	return (
		<Grid height={'80vh'} display={'grid'} alignItems={'center'}>
			<LocationMap />
		</Grid>
	);
};

export default Map;
