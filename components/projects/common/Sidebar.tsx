import { FC, useState } from 'react';
import { Grid, Paper, Button, CircularProgress } from '@material-ui/core';
import { Edit, CameraAlt } from '@material-ui/icons';
import {
  Chart,
  SeriesTemplate,
  CommonSeriesSettings,
  Size,
  Tooltip,
  Animation,
} from 'devextreme-react/chart';
import { useMutation } from '@apollo/client';
import { EditProjectDialog } from '../dialogs/EditProject';
import { useStyles } from './styles';
import { Project, Student } from '../../../interfaces';
import { formatDate, userCommits } from '../helpers';
import { TAKE_PROD_PREVIEW } from '../../../gql/queries/projects';
import * as githubLogo from '../../../assets/img/github_logo.png';
import * as netlifyLogo from '../../../assets/img/netlify_logo.png';

type SidebarProps = {
  project: Project;
  creationDate?: string;
  commits?: any[];
  updateProject: any;
};

export const Sidebar: FC<SidebarProps> = ({
  project,
  updateProject,
  creationDate,
  commits,
}) => {
  const classes = useStyles();
  const [dialog, setDialog] = useState(false);
  const chartData = commits ? userCommits(commits) : null;
  const [takeSnapshot, { loading }] = useMutation(TAKE_PROD_PREVIEW);
  const handleEditDialog = () => {
    setDialog(true);
  };
  const handleDialogClose = () => {
    setDialog(false);
  };
  const handleSave = () => {
    setDialog(false);
  };
  const handleSnapshot = async () => {
    await takeSnapshot({
      variables: {
        projectId: Number(project.id),
      },
    });
  };
  return (
    <>
      <Grid
        container
        direction="column"
        item
        xs={2}
        justify="flex-start"
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
          <Edit className={classes.editIcon} onClick={handleEditDialog} />
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
          {creationDate && (
            <Grid item className={classes.infoBox}>
              <strong>Created at:</strong>
              <br />
              {formatDate(creationDate)}
            </Grid>
          )}
          <Grid item className={classes.infoBox}>
            Links:
            <br />
            <a href={project.github_url}>
              <img
                alt="github_logo"
                src={githubLogo}
                style={{ padding: '5px' }}
              />
            </a>
            {project.prod_url && (
              <a href={project.prod_url}>
                <img
                  alt="netlify_logo"
                  src={netlifyLogo}
                  style={{ padding: '5px' }}
                />
              </a>
            )}
          </Grid>
          {project.prod_url && (
            <Grid item>
              Take preview:
              <br />
              <Button
                variant="contained"
                size="small"
                color="secondary"
                style={{ margin: '5px' }}
                onClick={handleSnapshot}
              >
                {loading ? (
                  <CircularProgress size={25} style={{ color: 'white' }} />
                ) : (
                  <CameraAlt />
                )}
              </Button>
            </Grid>
          )}
          <Grid container item justify="center" className={classes.infoBox}>
            {commits && (
              <Chart id="commitGraph" dataSource={chartData}>
                <Size width={250} height={250} />
                <CommonSeriesSettings
                  argumentField="user"
                  valueField="count"
                  type="bar"
                  ignoreEmptyPoints
                  showInLegend={false}
                  barPadding={0.6}
                />
                <SeriesTemplate nameField="user" />
                <Tooltip enabled />
                <Animation enabled />
              </Chart>
            )}
          </Grid>
        </Paper>
      </Grid>
    </>
  );
};
