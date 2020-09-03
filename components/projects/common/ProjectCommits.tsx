import { FunctionComponent } from 'react';
import { Grid } from '@material-ui/core';
import { Commit } from '../../../interfaces';
import { formatDate } from '../helpers';

type Props = {
  commits: Commit[];
};

const ProjectCommits: FunctionComponent<Props> = ({ commits }) => {
  return (
    <>
      {commits.map((commit) => {
        return (
          <Grid
            container
            item
            justify="center"
            style={{ padding: '4px' }}
            key={commit.id}
          >
            <Grid item xs={4}>
              {commit.author.user.login}
            </Grid>
            <Grid item xs={4}>
              <a href={commit.commitUrl}>{commit.message}</a>
            </Grid>
            <Grid item xs={4}>
              {formatDate(commit.committedDate)}
            </Grid>
          </Grid>
        );
      })}
    </>
  );
};
export default ProjectCommits;
