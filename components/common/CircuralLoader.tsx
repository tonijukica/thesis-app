import { FC } from 'react';
import { Grid, CircularProgress } from '@material-ui/core';

export const Loader: FC = () => {
  return(
    <Grid container direction = 'row' justify = 'center' alignItems = 'center' style = {{height: '600px'}}>
			<CircularProgress size={120} />
		</Grid>
  )
}