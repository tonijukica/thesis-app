import { FC } from 'react';
import { Grid, Paper, Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core';
import { Chart, ArgumentAxis, ValueAxis, SplineSeries, Tooltip } from '@devexpress/dx-react-chart-material-ui';
import { EventTracker } from '@devexpress/dx-react-chart';
import { commitHistory } from '../helpers';

type Props = {
	commits: any[];
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
    paper: {
      color: theme.palette.primary.main,
      paddingTop: '16px',
      paddingLeft: '16px',
      paddingRight: '16px',
      textAlign: 'center'
    }
	})
);

export const CommitGraph: FC<Props> = ({ commits }) => {
  const classes = useStyles();
	return (
		<Grid container direction='column' item xs={9} justify='center' style={{ marginLeft: '16px' }}>
			<Paper className={classes.paper}>
        <h2>Commits graph</h2>
        <br />
        <Grid container justify='center' item>
            <Chart data={commitHistory(commits)} width={900} height={500}>
              <ValueAxis />
              <ArgumentAxis />
              <EventTracker/>
              <Tooltip/>
              <SplineSeries color='#19857b' valueField='count' argumentField='date' />
            </Chart>
        </Grid>
			</Paper>
		</Grid>
	);
};
