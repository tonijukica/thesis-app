import { FunctionComponent, useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Collapse,
  IconButton,
  Button,
} from '@material-ui/core';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import CheckCircle from '@material-ui/icons/CheckCircleOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useQuery, useLazyQuery } from '@apollo/client';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useStyles } from './common/styles';
import GradeProjectDialog from './dialogs/GradeProjectDialog';
import {
  GET_PROJECT,
  GET_PROJECT_PREVIEWS,
  GET_COMMITS,
} from '../../gql/queries/projects';
import { Commit, Project } from '../../interfaces';
import { getUserRepoName } from './helpers';
import { Sidebar } from './common/Sidebar';
import { CommitGraph } from './common/CommitGraph';
import { Preview } from './common/ProductionPreview';
import { CommitList } from './common/CommitList';
import { Loader } from '../common/CircuralLoader';

type ProjectProps = {
  projectId: number;
};

const ProjectDetails: FunctionComponent<ProjectProps> = ({ projectId }) => {
  const classes = useStyles();
  const router = useRouter();
  const { data } = useQuery(GET_PROJECT, {
    variables: { projectId },
    pollInterval: 500,
  });
  const [
    getProdPreviews,
    { called, loading, data: prodPreviewData },
  ] = useLazyQuery(GET_PROJECT_PREVIEWS, {
    variables: { projectId },
    pollInterval: 500,
  });
  const [project, setProject] = useState<Project | null>(null);
  const [commits, setCommits] = useState<Commit[] | null>(null);
  const [expand, setExpand] = useState({
    details: true,
    previews: false,
    commits: false,
  });
  const [owner, setOwner] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [repoName, setRepoName] = useState('');
  const [gradeDialog, setGradeDialog] = useState(false);

  const { data: githubData, error } = useQuery(GET_COMMITS, {
    skip: !data,
    variables: {
      repoName,
      owner,
    },
    context: {
      clientName: 'github',
    },
  });
  const handleDetailsExpand = () => {
    setExpand({
      ...expand,
      details: !expand.details,
    });
  };
  const handlePreviewsExpand = () => {
    getProdPreviews();
    setExpand({
      ...expand,
      previews: !expand.previews,
    });
  };
  const handleCommitsExpand = () => {
    setExpand({
      ...expand,
      commits: !expand.commits,
    });
  };
  const updateProject = (state: Project | null) => {
    setProject(state);
  };

  const handleDialog = () => {
    setGradeDialog(!gradeDialog);
  };
  useEffect(() => {
    if (data) {
      setProject(data.projects[0]);
      const [user, repo] = getUserRepoName(data.projects[0]!.github_url);
      setOwner(user);
      setRepoName(repo);
    }
    if (githubData) {
      setCommits(githubData.repository.object.history.nodes);
      setCreationDate(githubData.repository.createdAt);
    }
  }, [data, githubData]);
  if (project && commits) {
    return (
      <>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <Button
              color="secondary"
              style={{ marginBottom: '4px' }}
              onClick={() => router.back()}
            >
              Back
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginBottom: '4px' }}
              onClick={handleDialog}
              endIcon={project.grade ? <CheckCircle /> : <ErrorOutline />}
            >
              Grade
              {project.grade ? <strong>({project.grade})</strong> : null}
            </Button>
          </Grid>
        </Grid>
        <GradeProjectDialog
          grade={project.grade!}
          projectId={project.id}
          name={project.name}
          open={gradeDialog}
          closeDialog={handleDialog}
        />
        <Card>
          <CardHeader
            title="Project overview"
            className={classes.cardHeader}
            action={
              <IconButton
                onClick={handleDetailsExpand}
                className={classNames(classes.expandIcon, {
                  [classes.expandIconOpen]: expand.details,
                })}
              >
                <ExpandMoreIcon />
              </IconButton>
            }
            onClick={handleDetailsExpand}
          />
          <Collapse in={expand.details}>
            <CardContent className={classes.cardContent}>
              <Grid
                container
                direction="row"
                justify="center"
                className={classNames(classes.details)}
              >
                <Sidebar
                  project={project}
                  updateProject={updateProject}
                  creationDate={creationDate}
                  commits={commits}
                />
                <CommitGraph commits={commits} />
              </Grid>
            </CardContent>
          </Collapse>
        </Card>
        {project.prod_preview_count! > 0 && (
          <Card className={classes.card}>
            <CardHeader
              title="Production previews"
              className={classes.cardHeader}
              action={
                <IconButton
                  onClick={handlePreviewsExpand}
                  className={classNames(classes.expandIcon, {
                    [classes.expandIconOpen]: expand.previews,
                  })}
                >
                  <ExpandMoreIcon />
                </IconButton>
              }
              onClick={handlePreviewsExpand}
            />
            <Collapse in={expand.previews}>
              <CardContent>
                {called && loading && <Loader />}
                {prodPreviewData && (
                  <Preview
                    previews={prodPreviewData.projects[0].production_previews!}
                  />
                )}
              </CardContent>
            </Collapse>
          </Card>
        )}
        <Card className={classes.card}>
          <CardHeader
            title="Commits"
            className={classes.cardHeader}
            action={
              <IconButton
                onClick={handleCommitsExpand}
                className={classNames(classes.expandIcon, {
                  [classes.expandIconOpen]: expand.commits,
                })}
              >
                <ExpandMoreIcon />
              </IconButton>
            }
            onClick={handleCommitsExpand}
          />
          <Collapse in={expand.commits}>
            <CardContent style={{ paddingBottom: '16px' }}>
              <CommitList commits={commits} />
            </CardContent>
          </Collapse>
        </Card>
      </>
    );
  } else if (error) {
    return (
      <>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <Button
              color="secondary"
              style={{ marginBottom: '4px' }}
              onClick={() => router.back()}
            >
              Back
            </Button>
          </Grid>
        </Grid>
        <Card>
          <CardHeader
            title="Project overview"
            className={classes.cardHeaderBad}
            action={
              <IconButton
                onClick={handleDetailsExpand}
                className={classNames(classes.expandIcon, {
                  [classes.expandIconOpen]: expand.details,
                })}
              >
                <ExpandMoreIcon />
              </IconButton>
            }
            onClick={handleDetailsExpand}
          />
          <Collapse in={expand.details}>
            <CardContent className={classes.cardContent}>
              <Grid
                container
                direction="row"
                justify="center"
                className={classNames(classes.details)}
              >
                <Sidebar
                  project={project!}
                  updateProject={updateProject}
                  creationDate={creationDate}
                />
              </Grid>
            </CardContent>
          </Collapse>
        </Card>
      </>
    );
  } else return <Loader />;
};
export default ProjectDetails;
