import { FC } from 'react';
import {
  Grid,
  Paper,
  Theme,
  makeStyles,
  createStyles,
} from '@material-ui/core';
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  LineSeries,
  Tooltip,
  Legend,
} from '@devexpress/dx-react-chart-material-ui';
import { EventTracker, Stack, Animation } from '@devexpress/dx-react-chart';
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
    },
  })
);

export const CommitGraph: FC<Props> = ({ commits }) => {
  const classes = useStyles();
  const chartData = userCommitsGraph(commits);
  const stack = [
    {
      series: chartData.graphCommits.map((el: any) => el.label),
    },
  ];
  return (
    <Grid
      container
      direction="column"
      item
      xs={9}
      justify="center"
      style={{ marginLeft: '16px' }}
    >
      <Paper className={classes.paper}>
        <h2>Commits graph</h2>
        <br />
        <Grid container justify="center" item>
          <Chart data={chartData.history} width={900} height={500}>
            <ValueAxis />
            <ArgumentAxis />
            <EventTracker />
            <Tooltip />
            {chartData.graphCommits.map((user: any) => {
              return (
                <LineSeries
                  key={user.label}
                  name={user.label}
                  valueField={user.label}
                  argumentField="date"
                />
              );
            })}
            <Animation />
            <Stack stacks={stack} />
            <Legend position="right" />
          </Chart>
        </Grid>
      </Paper>
    </Grid>
  );
};
