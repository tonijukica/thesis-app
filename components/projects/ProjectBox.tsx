import { FunctionComponent, useState, useEffect } from 'react';
import { Grid, makeStyles, createStyles, Card, CardActionArea, CircularProgress, Theme } from '@material-ui/core';
import { Student } from '../../interfaces';
import { useRouter } from 'next/router';
import DeleteProjectDialog from './dialogs/DeleteProjectDialog';
import { GET_REPO_INFO } from '../../gql/queries/projects';
import { useQuery } from '@apollo/react-hooks';
import { getUserRepoName, formatDate, projectStanding, dataExtract } from './helpers';

type ProjectBoxProps = {
	name: string;
	projectId: number;
	githubUrl: string;
	students: Student[];
  deleteMode: boolean;
  standingMode: boolean;
  handleDelete: any;
  removeProject: any
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
			backgroundColor: '#b7f2ae',
		},
		bad: {
			backgroundColor: '#ffb3b3',
		},
		warning: {
			backgroundColor: '#fffeb3',
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
      border: `2px solid ${theme.palette.secondary.main} !important`
		},
		cardActionArea: {
			paddingTop: '16px',
			paddingBottom: '16px',
      fontSize: '0.95em',
      minHeight: '64px'
		},
	})
);

const ProjectBox: FunctionComponent<ProjectBoxProps> = ({
  name,
  projectId,
  githubUrl,
  students,
  deleteMode,
  standingMode,
  handleDelete,
  removeProject
}) => {
	const classes = useStyles();
	const router = useRouter();
	const [commitNum, setCommitNum] = useState('');
  const [lastCommitDate, setLastCommitDate] = useState('');
  const [dialog, setDialog] = useState(false);
	const [user, repoName] = getUserRepoName(githubUrl);
	const { data } = useQuery(GET_REPO_INFO, {
		variables: {
			ownerName: user,
			repoName,
		},
		context: {
			clientName: 'github',
		},
	});
	useEffect(() => {
		if(data){
			const { num, date } = dataExtract(data);
			setCommitNum(num);
			setLastCommitDate(date);
		}
	}, [data]);

	const handleRedirect = (e: any) => {
		e.preventDefault();
		router.push(`/projects/${projectId}`);
  };
  const handleDialog = () => {
    setDialog(!dialog);
  }
  const style = () => {
    if(deleteMode)
      return [classes.card, classes.deleteHover].join(' ')
    else if(standingMode)
      return [classes.card, projectStanding(lastCommitDate, classes)].join(' ')
    else
      return classes.card
  }
	if(data)
		return (
      <Grid container direction='column' key={projectId}>
        <DeleteProjectDialog
          projectId={projectId}
          name={name}
          open={dialog}
          closeDialog={handleDialog}
          remove={removeProject}
        />
        <Card
          className={style()}
          onClick={deleteMode ? handleDialog : handleRedirect}
          key={projectId}
        >
          <CardActionArea className={classes.cardActionArea}>
            <Grid container direction='row' alignContent='center' alignItems='center' justify='space-evenly'>
              <Grid item xs={3}>
                {name}
              </Grid>
              <Grid container direction='column' item xs={3}>
                {students.map((student: Student) => (
                  <Grid key={student.id}>{student.name}</Grid>
                ))}
              </Grid>
              <Grid item xs={3}>
                {commitNum}
              </Grid>
              <Grid item xs={3}>
                {formatDate(lastCommitDate)}
              </Grid>
            </Grid>
          </CardActionArea>
        </Card>
      </Grid>
		);
	else
		return (
			<Grid className={classes.box} container direction='row' alignContent='center' alignItems='center' justify='space-evenly'>
				<CircularProgress />
			</Grid>
		);
};
export default ProjectBox;
