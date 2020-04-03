import { FunctionComponent, useState, useEffect, ChangeEvent } from "react";
import { Grid, Button, makeStyles, createStyles, TextField, InputAdornment, LinearProgress } from "@material-ui/core";
import { useQuery, useMutation } from "@apollo/react-hooks";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";
import ProjectBox from "./ProjectBox";
import ProjectDialog from "./dialogs/AddProjectDialog";
import BulkProjectDialog from "./dialogs/AddBulkProjectDialog";
import { GET_PROJECTS, INSERT_PROJECT, INSERT_BULK_PROJECTS, DELETE_PROJECT } from "../.././gql/queries/projects";
import { Student, Project } from "../../interfaces";
import Fuse from "fuse.js";

type ProjectListProps = {
	courseId: number;
};
const useStyles = makeStyles(() =>
	createStyles({
		container: {
			paddingBottom: "16px",
			borderBottom: "1px solid #e1e4e8 !important"
		},
		button: {
			marginRight: "8px"
		},
		header: {
			paddingTop: "16px",
			textAlign: "center",
			paddingBottom: "16px",
			borderBottom: "1px solid #e1e4e8 !important"
		}
	})
);

const ProjectList: FunctionComponent<ProjectListProps> = ({ courseId }) => {
	const classes = useStyles();
	const [dialogAdd, setDialogAdd] = useState(false);
	const [dialogBulk, setDialogBulk] = useState(false);
	const [deleteMode, setDeleteMode] = useState(false);
	const [searchParam, setSearchParam] = useState("");
	const [projects, setProjects] = useState<Project[]>([]);
	const [bulkProjects, setBulkProjects] = useState<[]>([]);
	const [projectName, setProjectName] = useState("");
	const [projectUrl, setProjectUrl] = useState("");
	const [deleteProject] = useMutation(DELETE_PROJECT);
	const { data, loading } = useQuery(GET_PROJECTS, { variables: { courseId } });
	const [insertProject] = useMutation(INSERT_PROJECT);
	const [insertProjects] = useMutation(INSERT_BULK_PROJECTS);
	const [students, setStudents] = useState<Student[]>([]);
	const fuseOptions = {
		shouldSort: true,
		minMatchCharLength: 3,
		threshold: 0.3,
		keys: ["name", "students.name"]
	};
	const fuse = new Fuse(projects, fuseOptions);
	useEffect(() => {
		if (data) setProjects(data.courses[0].projects);
		if (searchParam.length > 0) {
			const searchResults = fuse.search(searchParam);
			setProjects(searchResults);
		}
	}, [data, searchParam]);
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
	const handleProjectNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setProjectName(e.target.value);
	};
	const handleProjectUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
		setProjectUrl(e.target.value);
	};
	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchParam(e.target.value);
	};
	const addStudent = (student: Student) => {
		setStudents([...students, student]);
	};
	const handleDeleteProject = (projectId: number) => {
		deleteProject({
			variables: {
				projectId: Number(projectId)
			}
		}).then(() => {
			setProjects(projects.filter(project => project.id !== projectId));
		});
	};
	const addProject = () => {
		insertProject({
			variables: {
				courseId,
				projectName,
				githubUrl: projectUrl,
				students
			}
		}).then(({ data }) => {
			const projectData = data.insert_project;
			const newProject: Project = {
				id: projectData.id,
				name: projectData.name,
				github_url: projectData.github_url,
				students: projectData.students
			};
			setProjects([...projects, newProject]);
			setStudents([]);
		});
		setDialogAdd(false);
	};
	const addProjects = () => {
		return new Promise(resolve => {
			const newProjects = bulkProjects.map((project: any) => {
				return {
					...project
				};
			});
			insertProjects({
				variables: {
					projects: newProjects,
					courseId
				}
			}).then(({ data }) => {
				setProjects([...projects, ...data.insert_projects]);
				setDialogBulk(false);
				resolve();
			});
		});
	};
	return (
		<>
			<Grid container direction='row' justify='space-around' alignItems='flex-start' className={classes.container}>
				<Grid item xs={8}>
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
							)
						}}
					/>
				</Grid>
				<Grid container item xs={4} justify='flex-end' alignItems='flex-end'>
					<Button variant='contained' color='primary' className={classes.button} onClick={handleDialogAddOpen}>
						New
					</Button>
					<Button variant='contained' color='primary' className={classes.button} onClick={handleDialogBulkOpen}>
						Bulk insert
					</Button>
					<Button
						variant='contained'
						color='secondary'
						startIcon={<DeleteIcon />}
						className={classes.button}
						onClick={handleDeleteMode}
					>
						Delete
					</Button>
				</Grid>
			</Grid>
			<ProjectDialog
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
				<Grid item xs={3}>
					Project name
				</Grid>
				<Grid item xs={3}>
					Students
				</Grid>
				<Grid item xs={3}>
					Number of commits
				</Grid>
				<Grid item xs={3}>
					Last commit
				</Grid>
			</Grid>
			{loading && <LinearProgress />}
			{!loading &&
				projects &&
				projects.map((project: Project) => {
					return (
						<div key={project.id} onClick={() => (deleteMode ? handleDeleteProject(project.id) : null)}>
							<ProjectBox
								key={project.id}
								name={project.name}
								projectId={project.id}
								githubUrl={project.github_url}
								students={project.students}
								deleteMode={deleteMode}
								handleDelete = {handleDeleteProject}
							/>
						</div>
					);
				})}
		</>
	);
};
export default ProjectList;
