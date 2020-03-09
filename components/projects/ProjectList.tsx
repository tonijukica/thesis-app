import { FunctionComponent, useState, useEffect, ChangeEvent } from 'react';
import { Grid, Button, makeStyles, createStyles, TextField, InputAdornment, LinearProgress } from '@material-ui/core';
import { useQuery, useMutation } from '@apollo/react-hooks';
import  DeleteIcon from '@material-ui/icons/Delete';
import SearchIcon from '@material-ui/icons/Search';
import ProjectBox from './ProjectBox';
import ProjectDialog from './ProjectDialog';
import { GET_PROJECTS, INSERT_PROJECT, DELETE_PROJECT } from '../.././gql/queries/projects';
import { Student, Project } from '../../interfaces'; 
import Fuse from 'fuse.js';


type ProjectListProps = {
    courseId: number
}
const useStyles = makeStyles(() => createStyles({
   container: {
       paddingBottom: '16px',
       borderBottom: '1px solid #e1e4e8 !important'
   },
   button: {
    marginRight: '8px'
   },
   header: {
       paddingTop: '16px',
       textAlign: 'center',
       paddingBottom: '16px',
       borderBottom: '1px solid #e1e4e8 !important'
   }
  }));

const ProjectList: FunctionComponent<ProjectListProps> = ({courseId}) => {
    const classes = useStyles();
    const [dialog, setDialog] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);
    const [searchParam, setSearchParam] = useState('');
    const [projects, setProjects] = useState<Project []>([]);
    const [projectName, setProjectName] = useState('');
    const [projectUrl, setProjectUrl] = useState('');
    const [deleteProject] = useMutation(DELETE_PROJECT);
    const { data, loading } = useQuery(GET_PROJECTS, { variables: { courseId}});
    const [insertProject] = useMutation(INSERT_PROJECT);
    const [students, setStudents] = useState<Student []>([]);
    const fuseOptions = {
        shouldSort: true,
        minMatchCharLength: 3,
        threshold: 0.3,
        keys: ['name', 'students.name']
    }
    const fuse = new Fuse(projects, fuseOptions);
    useEffect(() => {
        if(data)
            setProjects(data.projects)
        if(searchParam.length > 0) {
            const searchResults = fuse.search(searchParam);
            setProjects(searchResults);
        }
    }, [data, searchParam]);
    const handleDialogOpen = () => {
        setDialog(true)
    }
    const handleDialogClose = () => {
        setDialog(false)
    }
    const handleDeleteMode = () => {
        setDeleteMode(!deleteMode);
    }
    const handleProjectNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setProjectName(e.target.value);
    }
    const handleProjectUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
        setProjectUrl(e.target.value);
    }
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchParam(e.target.value);
    }
    const addStudent = (student: Student) => {
        setStudents([...students, student]);
    }
    const handleDeleteProject = (projectId: number) => {
        deleteProject({
            variables: {
                projectId
            }
        })
        .then(() => {
            setProjects(projects.filter(project => project.id !== projectId));
        })
    }
    const addProject = () => {
        insertProject({
            variables: {
                courseId,
                projectName,
                githubUrl: projectUrl,
                students
        }})
        .then(({data}) => {
            const projectData = data.insert_projects.returning[0];
            const newProject: Project = {
                id: projectData.id,
                name: projectData.name,
                github_url: projectData.github_url,
                students: projectData.students
            };
            setProjects([ ...projects, newProject]);
            setStudents([]);
        })
        setDialog(false);
    }
    return(
        <>
        <Grid container direction = 'row' justify = 'space-around' alignItems = 'flex-start' className = {classes.container}>
            <Grid item xs = {8}>
                <TextField 
                    label = 'Search' 
                    variant = 'outlined' 
                    size = 'small'
                    onChange = {handleSearch}
                    InputProps = {{ 
                        startAdornment: (
                            <InputAdornment position = 'start'>
                                <SearchIcon />
                            </InputAdornment>
                        
                    )}} 
                    />
            </Grid>
            <Grid container item xs = {4} justify = 'flex-end' alignItems = 'flex-end'>
                <Button variant = 'contained' color = 'primary' className = {classes.button} onClick = {handleDialogOpen}>
                    New
                </Button>
                <Button variant = 'contained' color = 'primary' className = {classes.button}>
                    Bulk insert
                </Button>
                <Button variant = 'contained' color = 'secondary' startIcon = { <DeleteIcon/> } className = {classes.button} onClick = {handleDeleteMode}>
                    Delete
                </Button>
            </Grid>
        </Grid>
        <ProjectDialog 
            open = {dialog} 
            handleClose = {handleDialogClose} 
            handleNameChange = {handleProjectNameChange} 
            handleUrlChange = {handleProjectUrlChange}
            addStudent = {addStudent} 
            addProject = {addProject}
        />
        <Grid container direction = 'row' justify = 'space-evenly' className = { classes.header }>
            <Grid item xs = {3}>
                Project name
            </Grid>
            <Grid item xs = {3}>
                Students
            </Grid> 
            <Grid item xs = {3}>
                Number of commits
            </Grid> 
            <Grid item xs = {3}>
                Last commit
            </Grid> 
        </Grid>
        { loading &&  <LinearProgress/>}
        { !loading && projects.map((project: Project) => {
            return(
                <div key = {project.id} onClick = {() => deleteMode ? handleDeleteProject(project.id) : null}>
                    <ProjectBox 
                        key = {project.id} 
                        name = {project.name} 
                        projectId = {project.id}
                        githubUrl = {project.github_url}
                        students = {project.students}
                        deleteMode = {deleteMode}
                    />
                </div>
            )
        })}
        </>
    );
}
export default ProjectList;
