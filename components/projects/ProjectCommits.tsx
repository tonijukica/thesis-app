import { FunctionComponent } from 'react';
import { Grid } from '@material-ui/core';
import { Commit } from '../../interfaces';
type Props = {
  commits: Commit[]
}

const ProjectCommits: FunctionComponent<Props> = ({ commits }) => {
    return(
        <>
            {commits.map(commit => {
            return(
                <Grid container item justify = 'center' key = {commit.commitMsg}>
                    <Grid item xs = {4}>
                        {commit.user}
                    </Grid>
                    <Grid item xs = {4}>
                        {commit.commitMsg}
                    </Grid>
                    <Grid item xs = {4}>
                        {commit.date}
                    </Grid>
                </Grid>
            )
        })}
        </>
    )
}
export default ProjectCommits;
