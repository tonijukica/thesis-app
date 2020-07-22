import { FC } from 'react';
import { Grid, Paper, Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core';
import { Chart, Series, ArgumentAxis, Label, CommonSeriesSettings, Size, Animation, Tooltip  } from 'devextreme-react/chart'
import { userCommitsGraph } from '../helpers';

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
      textAlign: 'center',
      paddingBottom: '16px'
    }
	})
);

export const CommitGraph: FC<Props> = ({ commits }) => {
  const classes = useStyles();
  const chartData = userCommitsGraph(commits);
	return (
		<Grid container direction='column' item xs={9} justify='center' style={{ marginLeft: '16px' }}>
			<Paper className={classes.paper}>
        <h2>Commits graph</h2>
        <br />
        <Grid container justify='center' item>
          <Chart
            dataSource={chartData.history}

          >
            <Size
              width={900}
              height={500}
            />
            <CommonSeriesSettings
              type='line'
              argumentField='date'
            />
            {
              chartData.graphCommits.map((user: any) => {
                return(
                  <Series
                    key={user.label}
                    name={user.label}
                    valueField={user.label}
                  />
                )
              })
            }
            <ArgumentAxis>
              <Label
                wordWrap='none'
                overlappingBehavior='rotate'
              />
            </ArgumentAxis>
            <Animation
              enabled={true}
            />
            <Tooltip
              enabled={true}
            />
          </Chart>
        </Grid>
			</Paper>
		</Grid>
	);
};
