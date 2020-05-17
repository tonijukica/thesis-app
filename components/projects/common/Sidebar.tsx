import { FC, useState } from 'react';
import { Grid, Paper } from '@material-ui/core';
import { EditProjectDialog } from '../dialogs/EditProject';
import { useStyles } from './styles';
import { Project, Student } from '../../../interfaces';
import { formatDate, userCommits } from '../helpers';
import { Chart, ArgumentAxis, ValueAxis, BarSeries, Tooltip } from '@devexpress/dx-react-chart-material-ui';
import { EventTracker, Animation } from '@devexpress/dx-react-chart';
import { Edit } from '@material-ui/icons'
import * as githubLogo from '../../../assets/img/github_logo.png';
import * as netlifyLogo from '../../../assets/img/netlify_logo.png';

type SidebarProps = {
	project: Project;
	creationDate: string;
  commits: any[];
  updateProject: any
  ;
};

export const Sidebar: FC<SidebarProps> = ({ project, updateProject, creationDate, commits }) => {
  const classes = useStyles();
  const [dialog, setDialog] = useState(false);
  const chartData = userCommits(commits);
  const handleEditDialog = () => {
    setDialog(true);
  }
  const handleDialogClose = () => {
    setDialog(false);
  }
  const handleSave = () => {
    setDialog(false);
  }
	return (
		<>
			<Grid
				container
				direction='column'
				item
				xs={2}
				justify='flex-start'
				style={{ marginRight: '16px' }}
			>
        <Paper className={classes.projectInfo}>
          <EditProjectDialog
            project={project}
            updateProject={updateProject}
            open={dialog}
            handleClose={handleDialogClose}
            handleSave={handleSave}
          />
          <Edit className={classes.editIcon} onClick={handleEditDialog}/>
          <Grid item>
            <h2>Project information</h2>
          </Grid>
          <Grid item className={classes.infoBox}>
            <strong>Project name:</strong>
            <br />
            {project.name}
          </Grid>
          <Grid item className={classes.infoBox}>
            <strong>Students:</strong>
            <br />
            {project.students.map((student: Student) => {
              return (
                <div key={student.id}>
                  {student.name}
                  <br />
                </div>
              );
            })}
          </Grid>
          <Grid item className={classes.infoBox}>
            <strong>Created at:</strong>
            <br />
            {formatDate(creationDate)}
          </Grid>
          <Grid item className={classes.infoBox}>
            Links:
            <br />
            <a href={project.github_url}>
              <img src={githubLogo} style={{ padding: '5px' }} />
            </a>
            {project.prod_url && (
              <a href={project.prod_url}>
                <img src={netlifyLogo} style={{ padding: '5px' }} />
              </a>
            )}
          </Grid>
          <Grid container item justify='center' className={classes.infoBox}>
            <Chart data={chartData} width={200} height={250}>
              <ValueAxis />
              <ArgumentAxis />
              <EventTracker/>
              <Tooltip/>
              <Animation />
              <BarSeries color='#19857b' valueField='count' argumentField='user' />
            </Chart>
          </Grid>
        </Paper>
			</Grid>
		</>
	);
};
