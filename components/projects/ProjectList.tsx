import { FunctionComponent, useState, useEffect, ChangeEvent, useReducer } from 'react';
import { Grid, Button, makeStyles, createStyles, TextField, InputAdornment, LinearProgress, Theme, Switch, FormControlLabel, Collapse } from '@material-ui/core';
import { Alert } from '@material-ui/lab'
import { useQuery } from '@apollo/react-hooks';
import { Context, projectsReducer } from './Context';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import { Pagination } from '@material-ui/lab';
import ProjectBox from './ProjectBox';
import ProjectDialog from './dialogs/AddProjectDialog';
import BulkProjectDialog from './dialogs/AddBulkProjectDialog';
import { GET_PROJECTS  } from '../.././gql/queries/projects';
import { Project } from '../../interfaces';
import Fuse from 'fuse.js';
import orderBy from 'lodash.orderby';
import classnames from 'classnames';

type ProjectListProps = {
	courseId: number;
};

type SortType = {
  grade: null | Boolean,
  commitDate: null | Boolean
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			paddingBottom: '16px',
			borderBottom: '1px solid #e1e4e8 !important',
		},
		button: {
			marginRight: '8px',
    },
    switch: {
      color: theme.palette.primary.main,
      marginLeft: '12px'
    },
    delBtn: {
      marginRight: '8px',
      backgroundColor: theme.palette.error.main,
      color: 'white',
      '&:hover': {
        backgroundColor: theme.palette.error.dark
      }
    },
		header: {
      color: theme.palette.primary.main,
			paddingTop: '16px',
			textAlign: 'center',
			paddingBottom: '16px',
			borderBottom: '1px solid #e1e4e8 !important',
    },
    expandIcon: {
      transform: 'rotate(0deg)',
      paddingTop: '2px',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandIconUp: {
      transform: 'rotate(180deg)'
    },
    expandIconDown: {
      transform: 'rotate(0deg)'
    },
	})
);

const ProjectList: FunctionComponent<ProjectListProps> = ({ courseId }) => {
	const classes = useStyles();
  const [deleteMode, setDeleteMode] = useState(false);
  const [standingMode, setStandingMode] = useState(true);
	const [searchParam, setSearchParam] = useState('');
  const [state, dispatch] = useReducer(projectsReducer, {
    projects: [],
    dialogAdd: false,
    dialogBulk: false
  });
  const { data, loading } = useQuery(GET_PROJECTS, { variables: { courseId } });
  const [sort, setSort] = useState<SortType>({
    grade: null,
    commitDate: null
  });
  const rowsPerPage = 10;
  const [page, setPage] = useState(1);

	const fuseOptions = {
		shouldSort: true,
		minMatchCharLength: 3,
		threshold: 0.3,
		keys: ['name', 'students.name'],
	};
	const fuse = new Fuse(state.projects, fuseOptions);

	useEffect(() => {
		if(data)
      dispatch({
        type: 'set',
        projects: data.courses[0].projects
      });
		if(searchParam.length > 0){
			const searchResults = fuse.search(searchParam);
      dispatch({
        type: 'set',
        projects: searchResults
      });
		}
	}, [data, searchParam]);

  useEffect(() => {
    if(sort.grade === true){
      const sortedProjects = [...state.projects].sort((a, b) => b.grade! - a.grade!);
      dispatch({
        type: 'set',
        projects: sortedProjects
      });
    }
    else if(sort.grade === false){
      const sortedProjects = [...state.projects].sort((a, b) => a.grade! - b.grade!);
      dispatch({
        type: 'set',
        projects: sortedProjects
      });
    }
  }, [sort.grade]);
  useEffect(() => {
    if(sort.commitDate === true)
      dispatch({
        type: 'set',
        projects: orderBy(state.projects, ['lastCommitDate'], ['desc'])
      });
    else if(sort.commitDate === false)
      dispatch({
        type: 'set',
        projects: orderBy(state.projects, ['lastCommitDate'], ['asc'])
      });
  }, [sort.commitDate]);


	const handleDialogAddOpen = () => {
		dispatch({ type: 'dialogAddToggle'});
	};
	const handleDialogBulkOpen = () => {
		dispatch({ type: 'dialogBulkToggle'});
	};
	const handleDeleteMode = () => {
		setDeleteMode(!deleteMode);
  };
  const handleStandingMode = () => {
		setStandingMode(!standingMode);
  };
  const handleSortDate = () => {
    setSort({
      grade: null,
      commitDate: !sort.commitDate
    });
  }
  const handleSortGrade = () => {
    setSort({
      grade: !sort.grade,
      commitDate: null
    });
  }
  const sortStyle = (sort: Boolean | null) => {
    if(sort === true)
      return classnames(
        classes.expandIcon,
        classes.expandIconDown
      );
    else if(sort === false)
      return classnames(
        classes.expandIcon,
        classes.expandIconUp
      );
    else
      return '';
  }
  const sortIndicator = (sort: Boolean | null) => {
    if(sort !== true && sort !== false)
      return( <UnfoldMoreIcon style={{width: '20px'}}/>);
    else
      return(
      <ExpandMoreIcon
        fontSize='small'
        className={sortStyle(sort)}
      />
      );
  }
	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setPage(1);
		setSearchParam(e.target.value);
	};
  const removeProject = (projectId: number) => {
    const project: Project = state.projects.find((projectEl: Project) => projectEl.id === projectId)!;
    dispatch({
      type: 'remove',
      project
    });
  }
  const setLastCommitDate = (projectId: number, date: number) => {
    const project: Project = state.projects.find((projectEl: Project) => projectEl.id === projectId)!;
    project.lastCommitDate = date;
    const dateProjects = state.projects.map((projectEl: Project) => projectEl.id === projectId ? project : projectEl);
    dispatch({
      type: 'set',
      projects: dateProjects
    });
  }

  const handlePageChange = (event: any, value: number) => {
		if(event)
			setPage(value);
  };

	return (
		<>
    <Context.Provider value={{ state, dispatch }}>
			<Grid container direction='row' justify='space-around' alignItems='flex-start' className={classes.container}>
				<Grid container item xs={4}>
					<TextField
						label='Search'
						variant='outlined'
						size='small'
						onChange={handleSearch}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
									<SearchIcon />
								</InputAdornment>
							),
						}}
					/>
          <FormControlLabel
            className={classes.switch}
            control={
              <Switch checked={standingMode} color='secondary' onClick={handleStandingMode} />
            }
            label='Standing'
            labelPlacement='end'
          />
				</Grid>
        <Grid item xs={4}>
          <Collapse in={deleteMode}>
            <Alert severity="error">
              Delete mode is enabled
            </Alert>
          </Collapse>
        </Grid>
				<Grid container item xs={4} justify='flex-end' alignItems='flex-end'>
					<Button variant='contained' color='secondary' className={classes.button} onClick={handleDialogAddOpen}>
						New
					</Button>
					<Button variant='contained' color='secondary' className={classes.button} onClick={handleDialogBulkOpen}>
						Bulk insert
					</Button>
					<Button
						variant='contained'
						color='secondary'
						startIcon={<DeleteIcon />}
						className={classes.delBtn}
						onClick={handleDeleteMode}
					>
						Delete
					</Button>
				</Grid>
			</Grid>
			<ProjectDialog
        courseId={courseId}
			/>
			<BulkProjectDialog
        courseId={courseId}
			/>

			<Grid container direction='row' justify='space-evenly' className={classes.header}>
				<Grid item xs={2}>
					<strong>Project name</strong>
				</Grid>
				<Grid item xs={2}>
					<strong>Students</strong>
				</Grid>
				<Grid item xs={2}>
					<strong>Number of commits</strong>
				</Grid>
				<Grid container justify='center' item xs={2} onClick={handleSortDate}>
					<strong style={{marginLeft: '20px'}}>Last commit</strong>
          {
            sortIndicator(sort.commitDate)
          }
				</Grid>
        <Grid container  justify='center'item xs={2} onClick={handleSortGrade}>
          <strong style={{marginLeft: '20px'}}>Grade</strong>
          {
            sortIndicator(sort.grade)
          }
				</Grid>
			</Grid>
			{loading && <LinearProgress />}
			{!loading &&
				state.projects &&
        <Grid container direction='row' justify='center'>
          {
            state.projects.slice(page * rowsPerPage - rowsPerPage, page * rowsPerPage).map((project: Project) => {
              return (
              <ProjectBox
                key={project.id}
                name={project.name}
                projectId={project.id}
                grade={project.grade!}
                githubUrl={project.github_url}
                students={project.students}
                deleteMode={deleteMode}
                standingMode={standingMode}
                removeProject={removeProject}
                setDate={setLastCommitDate}
              />
            )})
          }
          <Grid container style={{marginTop: '16px'}} justify='center'>
            <Pagination
              shape='round'
              color='secondary'
              page={page}
              count={Math.ceil(state.projects.length / rowsPerPage)}
              onChange={handlePageChange}
            />
          </Grid>
        </Grid>
      }
    </Context.Provider>
		</>
	);
};
export default ProjectList;
