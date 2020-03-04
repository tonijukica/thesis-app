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
                <Grid container item justify = 'center' key = {commit.id}>
                    <Grid item xs = {4}>
                        {commit.author.user.login}
                    </Grid>
                    <Grid item xs = {4}>
                        <a href = {commit.commitUrl}>{commit.message}</a>
                    </Grid>
                    <Grid item xs = {4}>
                        {commit.committedDate}
                    </Grid>
                </Grid>
            )
        })}
        </>
    )
}
export default ProjectCommits;
