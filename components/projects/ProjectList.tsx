import { FunctionComponent, useState, useEffect, ChangeEvent } from 'react';
import { Grid, Button, makeStyles, createStyles, TextField, InputAdornment, LinearProgress, Theme, Switch, FormControlLabel, Collapse } from '@material-ui/core';
import { Alert } from '@material-ui/lab'
import { useQuery, useMutation } from '@apollo/react-hooks';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import { Pagination } from '@material-ui/lab';
import ProjectBox from './ProjectBox';
import ProjectDialog from './dialogs/AddProjectDialog';
import BulkProjectDialog from './dialogs/AddBulkProjectDialog';
import { GET_PROJECTS, INSERT_PROJECT, INSERT_BULK_PROJECTS } from '../.././gql/queries/projects';
import { Student, Project } from '../../interfaces';
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
	const [dialogAdd, setDialogAdd] = useState(false);
	const [dialogBulk, setDialogBulk] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [standingMode, setStandingMode] = useState(true);
	const [searchParam, setSearchParam] = useState('');
	const [projects, setProjects] = useState<Project[]>([]);
	const [bulkProjects, setBulkProjects] = useState<[]>([]);
	const [projectName, setProjectName] = useState('');
	const [projectUrl, setProjectUrl] = useState('');
  const { data, loading } = useQuery(GET_PROJECTS, { variables: { courseId } });
  const [sort, setSort] = useState<SortType>({
    grade: null,
    commitDate: null
  });
	const [insertProject] = useMutation(INSERT_PROJECT);
	const [insertProjects] = useMutation(INSERT_BULK_PROJECTS);
  const [students, setStudents] = useState<Student[]>([]);
  const rowsPerPage = 10;
  const [page, setPage] = useState(1);

	const fuseOptions = {
		shouldSort: true,
		minMatchCharLength: 3,
		threshold: 0.3,
		keys: ['name', 'students.name'],
	};
	const fuse = new Fuse(projects, fuseOptions);

	useEffect(() => {
		if(data)
			setProjects(data.courses[0].projects);
		if(searchParam.length > 0){
			const searchResults = fuse.search(searchParam);
			setProjects(searchResults);
		}
	}, [data, searchParam]);

  useEffect(() => {
    if(sort.grade === true){
      const sortedProjects = [...projects].sort((a, b) => b.grade! - a.grade!);
      setProjects(sortedProjects);
    }

    else if(sort.grade === false){
      const sortedProjects = [...projects].sort((a, b) => a.grade! - b.grade!);
      setProjects(sortedProjects);
    }
  }, [sort.grade]);
  useEffect(() => {
    if(sort.commitDate === true)
      setProjects(
        orderBy(projects, ['lastCommitDate'], ['desc'])
      );
    else if(sort.commitDate === false)
      setProjects(
        orderBy(projects, ['lastCommitDate'], ['asc'])
      );
  }, [sort.commitDate]);


	const handleDialogAddOpen = () => {
		setDialogAdd(true);
	};
	const handleDialogAddClose = () => {
		setDialogAdd(false);
	};
	const handleDialogBulkOpen = () => {
		setDialogBulk(true);
	};
	const handleDialogBulkClose = () => {
		setDialogBulk(false);
	};
	const handleDeleteMode = () => {
		setDeleteMode(!deleteMode);
  };
  const handleStandingMode = () => {
		setStandingMode(!standingMode);
  };
	const handleProjectNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setProjectName(e.target.value);
	};
	const handleProjectUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
		setProjectUrl(e.target.value);
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
	const addStudent = (student: Student) => {
		setStudents([...students, student]);
	};
  const removeProject = (projectId: number) => {
    setProjects(projects.filter((project) => project.id !== projectId))
  }
  const setLastCommitDate = (projectId: number, date: number) => {
    const project: Project = projects.find((projectEl: Project) => projectEl.id === projectId)!;
    project.lastCommitDate = date;
    setProjects(projects.map((projectEl: Project) => projectEl.id === projectId ? project : projectEl));
  }

	const addProject = () => {
		insertProject({
			variables: {
				courseId,
				projectName,
				githubUrl: projectUrl,
				students,
			},
		}).then(({ data }) => {
			const projectData = data.insert_project;
			const newProject: Project = {
				id: projectData.id,
				name: projectData.name,
				github_url: projectData.github_url,
				students: projectData.students,
			};
			setProjects([...projects, newProject]);
			setStudents([]);
		});
		setDialogAdd(false);
	};
	const addProjects = () => {
		return new Promise((resolve) => {
			const newProjects = bulkProjects.map((project: any) => {
				return {
					...project,
				};
			});
			insertProjects({
				variables: {
					projects: newProjects,
					courseId,
				},
			}).then(({ data }) => {
				setProjects([...projects, ...data.insert_projects]);
				setDialogBulk(false);
				resolve();
			});
		});
  };

  const handlePageChange = (event: any, value: number) => {
		if(event)
			setPage(value);
  };

	return (
		<>
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
				name={projectName}
				url={projectUrl}
				open={dialogAdd}
				handleClose={handleDialogAddClose}
				handleNameChange={handleProjectNameChange}
				handleUrlChange={handleProjectUrlChange}
				addStudent={addStudent}
				addProject={addProject}
			/>
			<BulkProjectDialog
				open={dialogBulk}
				handleClose={handleDialogBulkClose}
				bulkProjects={setBulkProjects}
				addProjects={addProjects}
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
				projects &&
        <Grid container direction='row' justify='center'>
          {
            projects.slice(page * rowsPerPage - rowsPerPage, page * rowsPerPage).map((project: Project) => {
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
              count={Math.ceil(projects.length / rowsPerPage)}
              onChange={handlePageChange}
            />
          </Grid>
        </Grid>
      }
		</>
	);
};
export default ProjectList;
