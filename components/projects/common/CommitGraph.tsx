import { FC } from 'react';
import { Grid, Paper } from '@material-ui/core';
import { Chart, ArgumentAxis, ValueAxis, SplineSeries } from "@devexpress/dx-react-chart-material-ui";
import { commitHistory } from '../helpers';

type Props = {
  commits: any[]
}

export const CommitGraph: FC<Props> = ({commits}) => {
  return(
    <Grid container direction='column' item xs={9}  justify='center' style={{ marginLeft: "16px" }}>
      <Grid item style={{textAlign: 'center', paddingBottom: '16px'}}>
            <h2>Commits graph</h2>
            <br/>
      </Grid>
      <br/>
        <Grid container justify = 'center' item>
          <Paper>
            <Chart data={commitHistory(commits)} width={900} height={500}>
              <ValueAxis />
              <ArgumentAxis />
              <SplineSeries valueField='count' argumentField='date' />
            </Chart>
          </Paper>
        </Grid>
    </Grid>
  )
}