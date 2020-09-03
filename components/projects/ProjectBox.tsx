import { FunctionComponent, useState, useEffect, useContext } from 'react';
import {
  Grid,
  makeStyles,
  createStyles,
  Card,
  CardActionArea,
  Theme,
  CircularProgress,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Context } from './Context';
import { Student, Project } from '../../interfaces';
import DeleteProjectDialog from './dialogs/DeleteProjectDialog';
import { GET_REPO_INFO } from '../../gql/queries/projects';

import {
  getUserRepoName,
  formatDate,
  projectStanding,
  dataExtract,
} from './helpers';

type ProjectBoxProps = {
  project: Project;
  setDate: any;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      textAlign: 'center',
      borderRadius: '3px',
      paddingTop: '16px',
      paddingBottom: '16px',
      marginBottom: '8px',
      marginTop: '8px',
    },
    good: {
      color: theme.palette.primary.main,
      backgroundColor: '#b7f2ae',
    },
    bad: {
      color: theme.palette.primary.main,
      backgroundColor: '#ffb3b3',
    },
    warning: {
      color: theme.palette.primary.main,
      backgroundColor: '#fffeb3',
    },
    finished: {
      backgroundColor: '#3D9970',
      color: 'white',
    },
    deleteHover: {
      '&:hover': {
        backgroundColor: 'grey',
        transform: 'scale(1.01)',
        cursor: 'pointer',
      },
    },
    card: {
      width: '100%',
      textAlign: 'center',
      marginBottom: '8px',
      marginTop: '8px',
      border: `2px solid ${theme.palette.secondary.main} !important`,
    },
    cardActionArea: {
      paddingTop: '16px',
      paddingBottom: '16px',
      fontSize: '0.95em',
      minHeight: '64px',
    },
    badProject: {
      width: '100%',
      textAlign: 'center',
      marginBottom: '8px',
      marginTop: '8px',
      border: `2px solid ${theme.palette.error.main} !important`,
    },
  })
);

const ProjectBox: FunctionComponent<ProjectBoxProps> = ({
  project,
  setDate,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const { state } = useContext(Context);
  const [commitNum, setCommitNum] = useState('');
  const [lastCommitDate, setLastCommitDate] = useState('');
  const [dialog, setDialog] = useState(false);
  const [user, repoName] = getUserRepoName(project.github_url);
  const { data, error } = useQuery(GET_REPO_INFO, {
    variables: {
      ownerName: user,
      repoName,
    },
    context: {
      clientName: 'github',
    },
  });
  useEffect(() => {
    if (data) {
      const { num, date } = dataExtract(data);
      setCommitNum(num);
      setLastCommitDate(date);
      setDate(project.id, date);
    }
  }, [data]);

  const handleRedirect = (e: any) => {
    e.preventDefault();
    router.push(`/projects/${project.id}`);
  };
  const handleDialog = () => {
    setDialog(!dialog);
  };
  const style = () => {
    if (project.grade) return [classes.card, classes.finished].join(' ');
    else if (state.standing)
      return [classes.card, projectStanding(lastCommitDate, classes)].join(' ');
    else return classes.card;
  };

  if (data || error)
    return (
      <Grid container direction="column" key={project.id}>
        <DeleteProjectDialog
          projectId={project.id}
          name={project.name}
          open={dialog}
          closeDialog={handleDialog}
        />
        <Card
          className={error ? classes.badProject : style()}
          onClick={state.delete ? handleDialog : handleRedirect}
          key={project.id}
        >
          <CardActionArea className={classes.cardActionArea}>
            <Grid
              container
              direction="row"
              alignContent="center"
              alignItems="center"
              justify="space-evenly"
            >
              <Grid item xs={2}>
                {project.name}
              </Grid>
              <Grid container direction="column" item xs={2}>
                {project.students.map((student: Student) => (
                  <Grid key={student.id}>{student.name}</Grid>
                ))}
              </Grid>
              {error ? (
                <>
                  <Grid item xs={2} />
                  <Grid item xs={2}>
                    Invalid GitHub Repo
                  </Grid>
                  <Grid item xs={2} />
                </>
              ) : (
                <>
                  <Grid item xs={2}>
                    {commitNum}
                  </Grid>
                  <Grid item xs={2}>
                    {formatDate(lastCommitDate)}
                  </Grid>
                  <Grid item xs={2}>
                    {project.grade ? project.grade : '-'}
                  </Grid>
                </>
              )}
            </Grid>
          </CardActionArea>
        </Card>
      </Grid>
    );
  else
    return (
      <Grid
        className={classes.box}
        container
        direction="row"
        alignContent="center"
        alignItems="center"
        justify="space-evenly"
      >
        <CircularProgress />
      </Grid>
    );
};
export default ProjectBox;
